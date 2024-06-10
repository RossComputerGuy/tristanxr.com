---
title: Why 16k page size matters
description: 16k vs 4k page sizes & Asahi Linux.
date: 2024-06-09 18:27:00 +0800
categories:
    - asahi-linux
---

Since August of 2023, I've been a daily user of a 14-inch 2021 Apple MacBook Pro (M1 Pro, 16GB RAM) laptop.
Thanks to [@tpwrules](https://github.com/tpwrules)'s [NixOS Asahi Linux Flake](https://github.com/tpwrules/nixos-apple-silicon/tree/main),
I was able to set up the laptop to run NixOS. The majority of software have worked perfectly on it and I
consider it to be the best Linux laptop for its performance. However, one major issue isn't a hardware issue
but a software one. When you see memory sizes on a system, you commonly think about things like the timing,
what kind of RAM chips they use, the number of RAM chips in a stick or channel of memory, and so on.
Though, this isn't that. This particular issue is one designed into the Asahi Linux kernel and even macOS's
Darwin kernel. This would be the page size, the number which dictates the minimum size of a page of memory is.
Every modern computer nowadays, since the mid 80's and into the 90's, use something called page memory. This is a
technique to efficiently manage memory but it is also used as a security mechanism. Programs can be given
permissions to only certain regions of memory via page memory. However, this exact issue is not an issue with the
security but the size.

The vast majority of users use x86 which utilizes 4k page memory. This size was great when page memory
was first introduced along with the Intel 386 in 1985. However, our memory sizes nowadays are vastly larger.
This means for a program to allocate something like 1GB of memory, they will need to ask the operating system
for a certain number of pages which gets them up to 1GB. On a 4k page size system, this would be about 244,141 pages
of memory. However, on a 16k page size system, this would be 61,036. Despite the math being 61035.15625, only whole pages
can be allocated. This means the memory allocator used will have to keep that last page for other memory allocations.
Between the 4k and 16k page sizes, it is clear that allocating a smaller number of pages can be beneficial when you
utilize programs that often are going to be allocating memory sizes beyond 1MB. This can result in a performance
improvement as there will be less work the CPU will have to do to ensure the program gets the correct number of pages.

Due to Asahi Linux using 16k page size memory, this means programs not coded to expect a 16k page size will fail.
This is also true for the new Raspberry Pi 5 where the stock OS uses a 16k page size. A few notable programs which
break under the 16k page size are Zig, Wine, and Telegram. Telegram for one uses jemalloc which does not ask the
operating system for the page size and chooses to pick the size at build time. This causes breakage with prebuilt binaries
and distributed versions of the program like the Flatpak or an AppImage. Wine breaks due to it being a runtime environment
and so it has to mimick a Windows environment. Zig breaks due to the page size being a constant variable instead of a function,
it expects a 4k page size on any ARM system.

Although many programs are broken due to the 16k page size on these modern systems, they will be patched.
Asahi Linux has a page on their wiki for [broken software](https://github.com/AsahiLinux/docs/wiki/Broken-Software) which
are often attributed to this exact issue. If you do find a piece of software which breaks due to this incompatibility, I can
heavily recommend you open an issue on that software's issue tracker and link it to the Asahi Linux's broken software page.
In due time, more systems will come out with 64-bit ARM CPU's and many will likely use the 16k page size because of its
performance benefits. More broken software will be found but thanks to the developers or contributors, it will be fixed.
