---
title: SELinux on NixOS
description: The world of MAC security on Linux in NixOS
date: 2025-04-05 18:00:00 +0800
categories:
    - nix
---

Since Wednesday, I've been hard at work with trying to get SELinux
(Security Enhanced Linux) to function on NixOS. This is because I
am building a Linux distro called [ExpidusOS](https://expidusos.com).
One of the goals for that is to implement a mobile OS security setup
into the OS. With ExpidusOS being based on NixOS, this means the entire
OS is declaratively built. However, it is more in-line with an appliance
OS. This is to increase security and make it easier for the end user to
utilize.

## Packaging SELinux

SELinux was luckily already packaged in nixpkgs, but it hadn't been
maintained in a long time. That is until I picked it up last year.
I had been a the maintainer of it for about a year. But now,
I am finally getting involved in making SELinux on NixOS a reality.
The only real work has been making sure there's little existing
problems reported and reviewing any pull requests. However, I did
have to package the [SELinux reference policy](https://github.com/SELinuxProject/refpolicy).
The `refpolicy` is a simple SELinux policy that provides enough
for a usable experience. It is in no way a fully secure policy
but it is a good enough policy to work off of.

To package it, I started out with a typical Nix derivation
which fetches from GitHub. However, I did have to add a few
things that are unique like `makeFlags`. This attribute
holds all the flags to pass over to GNU Make as `refpolicy`
is built with GNU Makefiles. One of the few differences was
adding in `make conf` as the `configurePhase` and passing in
the various SELinux userspace tools in through `makeFlags`.
From there, I was able to build the policy. Though, it did
end up with `$out/usr` but that was as simple as adding this to
the `makeFlags`:

```nix
"prefix=${placeholder "out"}"
```

With the `refpolicy` derivation outputting correctly, it was time
to figure out how SELinux works and getting it functioning.

## Starting the SELinux NixOS module

The first thing I did on the NixOS side was I created a basic module.
This module added `libselinux` and `policycoreutils` to
`environment.systemPackages`. It also created `/etc/selinux/config`,
the configuration file which configures SELinux on the distro. I also
added a kernel patch via `boot.kernelPatches` which enabled
`CONFIG_SECURITY_SELINUX` and `CONFIG_SECURITY_SELINUX_BOOTPARAM`.
I then added `security=selinux` to `boot.kernelParams`. With this,
I booted up the NixOS VM and checked `sestatus` to ensure SELinux
was enabled. However, it reported as disabled. I tried various other
kernel parameters and versions of the kernel. This led me to trying
systemd with SELinux enabled in `systemd.package`. I booted up the
VM and got a warning saying `/etc/selinux/refpolicy/policy/policy.33`
did not exist. `sestatus` also reported that SELinux was indeed enabled.
This was the first large step towards getting SELinux working. The next
step was getting the `policy.33` file to exist.

## Getting a policy loaded

Making a policy load on NixOS was a bit of an endeavor as there wasn't
many tutorials I could find which explained things very aptly. I checked
what Gentoo and Arch Linux does and found that Arch Linux's
`selinux-refpolicy-git`'s install script from the AUR is what I needed.
The solution I came up with was to tack it into the activation script.
This would install the policy upon the NixOS generation was activated.

At this point, I got stuck and ran into a broken pipe error. I eventually
managed to figure out via verbose mode that it was looking for `hll` in
a FHS path and not within the Nix store. I grepped SELinux's source code
and stumbled upon `libsemanage` having a configuration file format. This
would be perfect as it allows for specifying the paths to the various
tools `semodule` calls. I added the paths for `hll`, `load_policy`,
`setfiles`, and `sefcontext_compile`. I also had to tack on the
arguments that `libsemanage` uses by default for the last three tools.

Once `semanage` was using its configuration file inside `/etc/selinux`,
I booted up the VM one more time. The boot stalled and the error about
`/etc/selinux/refpolicy/policy/policy.33` was still present. I checked
the path and found `/etc/selinux/refpolicy/policy/policy.34` existed.
I checked `sestatus` and it said the system was using policy v33.

## Getting the right policy version

SELinux spitting out `policy.34` instead of `policy.33` stumpted me.
Until, I grepped the SELinux source tree more. I found out that SELinux's
userspace tools default to the max version. The max version which at this
time is 34. The kernel I was using has an SELinux version of 33. This
meant that I had to get `refpolicy` to build for SELinux policy 33
instead of 34. I found that various tools in SELinux support specifying
the version. However, `refpolicy` has a flag for changing the version. This
led me to add two new attributes which can be overridden when building
`refpolicy`, `policyVersion` and `moduleVersion`. I also added a
`policyVersion` option to the SELinux module in NixOS.

After rebuilding the VM and deleting the `qcow2` image as a precaution,
I booted up the VM one more time. It did the usual stall on boot when
`semanage` would install the policy. After about 40 seconds, the system
initialization continued. However, the error about the missing `policy.33`
file went away. Other messages complaining about various systemd things
also disappeared. I checked `/etc/selinux/refpolicy/policy/policy.33` and
it existed. `sestatus` also mentioned the policy is `refpolicy`. These
two indicated that SELinux is indeed working.

## Configuring SELinux in nixpkgs

With SELinux properly loading a policy, I decided to start cleaning
up how SELinux is handled on nixpkgs. I started with checking for
everything which optionally added SELinux based on an attribute.
I also added a new nixpkgs config flag called `selinuxSupport`. This
config flag is able to rebuild everything from coreutils to postgres
and emacs. It enables SELinux support everywhere it is possibly supported.
This process was pretty straight forward and went very smoothly.

## Upstreaming into nixpkgs

All this work for ExpidusOS had been made with the intention of it
going back into nixpkgs and NixOS upstream. I made the following pull
requests:

- [libselinux: 3.8 -> 3.8.1 #396105](https://github.com/NixOS/nixpkgs/pull/396105)
- [selinux-refpolicy: init 2.20250213 #396155](https://github.com/NixOS/nixpkgs/pull/396155)
- [pkgs/top-level/config.nix: add selinux support #396168](https://github.com/NixOS/nixpkgs/pull/396168)
- [nixos/selinux: init #396177](https://github.com/NixOS/nixpkgs/pull/396177)

These four pull requests ended up being all it takes to get basic SELinux
support into NixOS and nixpkgs. In my time of looking at various things,
I came across an RFC ([[RFC 0041] SELinux Support #41](https://github.com/NixOS/rfcs/pull/41)).
Reading through it, I see why SELinux support hadn't been done to this degree
before. However, I believe the work I have done here and the ExpidusOS project
to push SELinux support to be capable of securing a NixOS appliance OS.

## Next steps

The next step from here is get everything upstreamed. From there, I plan on
working out a way to do declarative policy creation within the NixOS module
system. This would make handling policies better than using `refpolicy`.
From there, it can be investigated how this impacts the Nix daemon and
building in general.
