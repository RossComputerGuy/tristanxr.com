---
title: Resumé
menu:
  main:
    name: Resumé
    weight: 3
    params:
      icon: file-text
---

# Notable PR's

## LLVM

### [BOLT] Enable standalone build

Allows LLVM bolt from building outside the LLVM source tree.

[Link](https://github.com/llvm/llvm-project/pull/97130)

### [libc] init uefi os target

Implements support for building & running applications in a UEFI environment
with the LLVM libc.

[Link](https://github.com/llvm/llvm-project/pull/120687)

## Nixpkgs

### flutter.engine: init

Packages the source built Flutter engine.

[Link](https://github.com/NixOS/nixpkgs/pull/212328)

### llvmPackages_{12,13,14,15,16,17,18,19,git}: commonify patches

Eliminates duplicate patches by implementing a function which points
to a specific file per each LLVM version.

[Link](https://github.com/NixOS/nixpkgs/pull/333521)

### llvmPackages_{12,13,14,15,16,17,18,git}: use common

Several PR's to eliminate duplicate Nix files for each LLVM subpackage.

[Link: clang](https://github.com/NixOS/nixpkgs/pull/303948)

[Link: compiler-rt](https://github.com/NixOS/nixpkgs/pull/303479)

[Link: libcxx](https://github.com/NixOS/nixpkgs/pull/303449)

[Link: libunwind](https://github.com/NixOS/nixpkgs/pull/303447)

[Link: llvm](https://github.com/NixOS/nixpkgs/pull/303521)

[Link: openmp](https://github.com/NixOS/nixpkgs/pull/303448)

### zig: commonify & bootstrap

Clean up Zig's nix files to enable better use of the Zig C compiler.
Reduces duplicate code by using a central entry point.

[Link](https://github.com/NixOS/nixpkgs/pull/331011)

## Zig

### std: implement basic io and improve alloc in uefi

Improvements to Zig's standard lib which allows for a hello world to
be built using `std.debug.print` for UEFI. The PR also improves how the memory
allocations are handled for UEFI.

[Link](https://github.com/ziglang/zig/pull/22226)

# Projects

## Nixpkgs LLVM Workspace

Flake workspace / repo to stage and track Nixpkgs/NixOS's ability to be compiled completely with LLVM.

[Link](https://github.com/RossComputerGuy/nixpkgs-llvm-ws)

## uekit

A toolchain and emulator for Usagi Electric's UE-2 vacuume tube computer.

[Link](https://github.com/RossComputerGuy/uekit)

## Phantom UI

A UI framework alternative to Flutter written in pure Zig, capable of working in UEFI and various
other platforms.

[Link](https://github.com/PhantomUIx)

## ExpidusOS

Mobile and desktop operating system based on NixOS and Flutter.

[Link](https://expidusos.com)

# Experience

## Jr DevOps Engineer - Ezoic

<sub>August 2022 - January 2023</sub>

I had the opportunity to work at Ezoic for about 6 months as a DevOps Engineer.
It was a great opportunity despite it being short lived.
I made great friends and connections along the way.

## Stocker - 88 Ranch Marketplace

<sub>March 2022 - August 2022</sub>

After moving to California, I switched to an Asian market called 88 Ranch.
It has allowed me to learn about how stores put out products.
Another ability I have learned is front facing, a technique used to ensure more
product is sold and a method of organization. 

## Cashier - Chipotle

<sub>November 2019 - March 2022</sub>

Not my first choice for a place to work at but it was a good experience.
I got to meet many new people and some who have become my friends.
I learned certain necessary aspects of work such as time management and customer service.

# Education

## Associates of Applied Science - Portland Community College

<sub>September 2020 - June 2025</sub>

This degree focuses on many elementary topics for Linux, web development, and data communications.

# Talks

## The Nix PR Pipeline

<sub>[Link](https://www.socallinuxexpo.org/scale/22x/presentations/nix-pr-pipeline)</sub>

Event: SCALE 22x / Planet Nix - Room 101
Time: 2025-03-06 10:00 - 10:30 (PST)

A detailed explanation of how pull requests are staged and trickle into the
different channels in Nixpkgs and NixOS.
