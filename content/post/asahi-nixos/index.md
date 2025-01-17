---
title: The Asahi NixOS Experience
description: My 1.5 year experience with Asahi NixOS
date: 2025-01-17 10:11:00 +0800
categories:
    - asahi-linux
    - nix
---

In August of 2023, I was looking around for a new laptop. At the time,
I was running an Alienware laptop with an RTX 3070 in it. However, it
is a cumbersome machine with horrible battery life. The great thing was
its performance. I needed a machine which was powerful, can run Linux,
has great battery life, and portable. I wrote off x86 as S0 sleep mode
(Windows Modern Standby) became pervasive, many vendors omitted or
improperly handle normal S3 sleep. This led me to an ARM machine.
The introduction of compelling ARM-powered laptops led me to select
the 2021 MacBook Pro. It has 16GB of RAM and 1TB of storage. To save
money, I went with one from Apple's refurbishment service.

## The Installation Process

As soon as my Macbook Pro arrived, I began installing Nix on Darwin. It was
a troublesome experience trying to integrate it properly in my Flake config.
After a few hours, I was able to get home-manager working with Nix on Darwin.
However, I wasn't done yet and I wanted Linux on this machine. So I stumbled
upon [Thomas Watson](https://github.com/tpwrules)'s
[`nixos-apple-silicon`](https://github.com/tpwrules/nixos-apple-silicon) Flake.

The installation went smoothly, after disabling System Integrity Protection and
running the Asahi Linux setup script, I was ready to begin. I grabbed my flash drive
with Thomas's Asahi NixOS installer on it. From there, installation proceeded like
normal for NixOS. I set up an ext4 partition, pull my Flake, and run `nixos-install`.

After some time of building, I then had NixOS on Apple Silicon. I had my
desktop environment setup like how it is on my other machines but on ARM.
Unfortunately, audio wasn't working properly at the time so I had to rely on
Bluetooth. However, this became less of a problem after months had progressed.
I've been happily running NixOS with Asahi packages on an M1 Pro.

## The Problems

A few problems I ran into with daily driving Asahi NixOS was the system
did not have enough memory and not enough storage. I decided to get rid of
the replace mode for the Mesa fork and go with an overlay. This would allow
me to build my configuration on Garnix, a Nix CI service. However, this had
the side effect of causing a mass rebuild of everything requiring Mesa.
Not too long after, I had gained access to the Nix community aarch64 machine.
I was then able to use it to build the heavy parts of my configuration. The
reason why Garnix couldn't build it was either Garnix didn't provide aarch64
at the time or I hadn't gotten my configuration to properly take advantage of
Garnix's cache.

During my work with LLVM, I also was experiencing massive usages in memory
and storage usage. I had configured my system to use half of the drive while
macOS uses the other half. This is so I could have the best of both worlds.
Unfortunately, this has restricted how much storage I have so I'd often
be running the Nix garbage collector. I've also experienced problems with memory.
Due to only having 16GB of RAM and the system using unified memory, there's cases
where I can easily run into the out of memory killer triggering and causing jobs
to fail. A solution has been to limit the number of jobs. However, these problems
are less of a concern after I built my Ampere Altra desktop in July of 2024.

## Gaming

Many people may think you cannot game on a Macbook. However, that is not the case.
There's been many documented cases of people playing Steam games on Apple Silicon
machines. Even on macOS, Steam works with Apple's x86 translation layer. However,
on Linux we have to use box86. The problem is, Apple Silicon uses a 16k page size
due to how the IOMMU is designed. The solution has been to use a project called muvm,
formerly called krunvm. However, this tool is new enough that getting it working on NixOS
isn't quite possible yet.

## Battery Life

One of the big requirements for me when I got this machine was battery life.
In macOS alone, the system can last days in sleep which is a great improvement over
the 3 hours my Alienware could last in sleep mode. However, it looks like the Asahi
project has not fully gained that level of sleep performance (Reference
[issue AsahiLinux/linux#262 - "sleep mode battery improvement"](https://github.com/AsahiLinux/linux/issues/262)).
Despite the battery life not being as good as macOS, I can have my machine on
battery for 13 hours while alseep. This is a huge improvement over my Alienware but
isn't much of a concern as I charge my system overnight and usually have access to
power. Although, I mostly have access to an outlet, I like being able to sit on a
couch at home or sit on my bed while I work. While working, I can get somewhere
between 2 hours and 5 hours of battery life. It is very dependant on what I am working
on. If I am building LLVM, I can get 4 full builds and tests of libLLVM to a clang binary 
and still have 32% battery life. With web browsing and video playback, I can get closer
to the 5 or 6 hour life.

## Summary

The Asahi project and Thomas Watson have done a great job at getting Linux
and NixOS to work well with Apple's ARM chips. The battery life is long enough for me
to get plenty of work done while I am not tethered to a wall. The system's performance
is quite capable despite being limited by memory and storage. It is my go-to machine
and my favorite to use when I don't have to be at a desk. This machine is an example
of why ARM is the future.
