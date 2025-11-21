---
title: Nix on the DC ROMA II
description: Getting Nix bootstrapped on a RISC-V laptop using Ubuntu.
date: 2025-11-17 11:50:00 +0800
categories:
    - riscv
---

At NixCon 2025, I had the pleasure of meeting the Founder of DeepComputing, Yuning Liang.
I was excited as I ordered their new laptop, the DC ROMA II, a few months prior. It has an ESWIN EIC7700X,
an SoC with 8 out of order execution RV64GBC cores. This is a huge upgrade compared to the 4 in-order
execution cores on the JH7110 that the VisionFive 2 uses. I started looking into getting Nix & NixOS working
on it shortly after receiving it. Surely since I am able to port NixOS to things like the FydeTab Duo and get
a VisionFive 2 to work, I should be able to get this system working.

The first thing I did was install Nix, however there's no prebuilt binaries for Nix that the installer script
utilizes. I took a look at the installer script and found a convinient option called `--tarball-url-prefix`.
I spun up a build of Nix for RISC-V using an Arm cross environment. However, I ended up not needing that due
to Hydra conviently having done that for me in
[Build 312888635 of job nix:master:binaryTarballCross.x86_64-linux.riscv64-unknown-linux-gnu](https://hydra.nixos.org/build/312888635).
I managed to even point `--tarball-url-prefix` to
[`nix-2.33.0pre20251111_af0ac14-riscv64-linux.tar.xz`](https://hydra.nixos.org/build/312888635/download/1/nix-2.33.0pre20251111_af0ac14-riscv64-linux.tar.xz).
Once I ran the installer, the installation experience was smooth. I restarted the shell and ran `nix --version` which told me that I have 2.33.0.

After installing Nix, I decided to try building `nix-info`. I ran `nix-shell -p nix-info` which seemed to start smoothly,
but was quickly interrupted as bootstrap-tools failed to build. This is a big problem, as the `bootstrap-tools` derivation is
a crucial part of the nixpkgs bootstrap process. It takes a pre-built tarball of various tools like `coreutils`, `gcc`, `patchelf`,
and a subset of `binutils`. It provides the necessary commands to bootstrap nixpkgs from a small footprint and in a sandboxed
environment. I managed to cross compile a new bootstrap tools tarball on my Ampere desktop, copied that over and hacked around
`import <nix/fetchurl.nix>` so it did `url = "file://${./bootstrap-tools.tar.xz}";` instead of fetching from the tarballs server.
This allowed me to use the new bootstrap tools. Once that was done, I attempted another build and the bootstrap tools managed to build.
However, this was only a temporary victory.

After chatting with other NixOS contributors, it turns there's an issue in nixpkgs regarding PIE. PIE is a method of allowing programs
to be relocated. This is useful on systems with limited address spaces and helps prevent libraries from colliding due to
occupying the same address. The issue was discovered by using `strace -E LD_DEBUG=all` on GCC. This revealed the following logs:

```
execve("/nix/store/kg61gdq4svvph0c4pcsf867r8nkbiqs7-bootstrap-tools/lib/ld-linux-riscv64-lp64d.so.1", ["/nix/store/kg61gdq4svvph0c4pcsf8"..., "/nix/store/kg61gdq4svvph0c4pcsf8"0
brk(NULL)                               = 0x7fff84224000
openat(AT_FDCWD, "/nix/store/kg61gdq4svvph0c4pcsf867r8nkbiqs7-bootstrap-tools/bin/gcc", O_RDONLY|O_CLOEXEC) = 3
read(3, "\177ELF\2\1\1\3\0\0\0\0\0\0\0\0\2\0\363\0\1\0\0\0\230\312\2\0\0\0\0\0"..., 832) = 832
getpid()                                = 6665
writev(2, [{iov_base="      6665:\t", iov_len=12}, {iov_base="file=", iov_len=5}, {iov_base="/nix/store/kg61gdq4svvph0c4pcsf8"..., iov_len=67}, {iov_base=" [", iov_len=2}, {iovp
) = 111
mmap(0xf000, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_FIXED|MAP_DENYWRITE, 3, 0) = -1 EPERM (Operation not permitted)
close(3)                                = 0
writev(2, [{iov_base="/nix/store/kg61gdq4svvph0c4pcsf8"..., iov_len=67}, {iov_base=": ", iov_len=2}, {iov_base="error while loading shared libra"..., iov_len=36}, {iov_base=": t
) = 217
exit_group(127)                         = ?
+++ exited with 127 +++
```

If you look closely, you'll see the `mmap` call. It's attempting to map address 0xf000 with a 4kb size and have it be read-write.
However, you will notice that the syscall is returning `-1` and indicating an error code, `EPERM`. Not being able to mmap the address
is causing a big problem since looking at the ELF header using `readelf -l`, you can see that is used by the program header (`PHDR`).

```
Program Headers:
  Type           Offset             VirtAddr           PhysAddr
                 FileSiz            MemSiz              Flags  Align
  PHDR           0x0000000000000040 0x000000000000f040 0x000000000000f040
                 0x00000000000002a0 0x00000000000002a0  R      0x8
  RISCV_ATTRIBUT 0x0000000000219e92 0x0000000000000000 0x0000000000000000
                 0x0000000000000057 0x0000000000000000  R      0x1
  GNU_STACK      0x0000000000001000 0x0000000000000000 0x0000000000000000
                 0x0000000000000000 0x0000000000000000  RW     0x10
  LOAD           0x0000000000000000 0x000000000000f000 0x000000000000f000
                 0x0000000000001000 0x0000000000001000  RW     0x1000
  LOAD           0x0000000000001000 0x0000000000010000 0x0000000000010000
                 0x000000000020ded0 0x000000000020ded0  R E    0x1000
  INTERP         0x00000000000142d0 0x00000000000232d0 0x00000000000232d0
                 0x000000000000005c 0x000000000000005c  R      0x1
      [Requesting program interpreter: /nix/store/kg61gdq4svvph0c4pcsf867r8nkbiqs7-bootstrap-tools/lib/ld-linux-riscv64-lp64d.so.1]
  NOTE           0x0000000000014330 0x0000000000023330 0x0000000000023330
                 0x0000000000000020 0x0000000000000020  R      0x4
  GNU_EH_FRAME   0x00000000001c41d8 0x00000000001d31d8 0x00000000001d31d8
                 0x000000000000967c 0x000000000000967c  R      0x4
  LOAD           0x000000000020ef58 0x000000000021ef58 0x000000000021ef58
                 0x000000000000af28 0x00000000000103b8  RW     0x1000
  TLS            0x000000000020ef58 0x000000000021ef58 0x000000000021ef58
                 0x0000000000000000 0x0000000000000010  R      0x8
  GNU_RELRO      0x000000000020ef58 0x000000000021ef58 0x000000000021ef58
                 0x00000000000080a8 0x00000000000080a8  R      0x1
  DYNAMIC        0x0000000000216dd0 0x0000000000226dd0 0x0000000000226dd0
                 0x0000000000000230 0x0000000000000230  RW     0x8
```

Although this is useful information, it does not clearly state why that is a problem.
All of these addresses fit within the RISC-V specification for alignment and generally looks safe.
However, if you look at the ELF header, it tells a different story.

```
ELF Header:
  Magic:   7f 45 4c 46 02 01 01 03 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - GNU
  ABI Version:                       0
  Type:                              EXEC (Executable file)
  Machine:                           RISC-V
  Version:                           0x1
  Entry point address:               0x2ca98
  Start of program headers:          64 (bytes into file)
  Start of section headers:          2203656 (bytes into file)
  Flags:                             0x5, RVC, double-float ABI
  Size of this header:               64 (bytes)
  Size of program headers:           56 (bytes)
  Number of program headers:         12
  Size of section headers:           64 (bytes)
  Number of section headers:         31
  Section header string table index: 30
```

Now the problem is revealed, the PIE flag is not set.
What this means is the kernel is doing the following steps:

1. Checks ELF magic
2. Iterate through each section
3. Check the address is lower than `vm.mmap_min_addr` & PIE is set
    - If the PIE flag is set, ignore the `vm.mmap_min_addr` sysctl
    - If the address is lower, fails
    - If the address is higher, succeeds
4. Executes

This is roughly an oversimplified explanation of how a program is loaded. So we know PIE is not set, however there's
the other problem. I ran `cat /proc/sys/vm/mmap_min_addr` and got back 65536. Now that explains what's going on, the
address we're trying to have mapped is lower than what the kernel is permitting. I decided to try `sysctl -w vm.mmap_min_addr=4096`
and ran the build again.

After attempting to build again, everything continued to work. The next thing to do will be fixing PIE on RISC-V in nixpkgs but
that'll be a future thing to do. Until then, I'll be making progress on getting NixOS to boot.
