---
title: Commonifying LLVM in Nixpkgs
description: How I was able to reduce complexity and technical debt in Nixpkgs for LLVM.
date: 2024-06-08 18:16:00 +0800
---

In programming, technical debt often accumulates over time. It often occurs with legacy code
or things which are not maintained often. Recently, I became one of the maintainers for
LLVM in Nixpkgs. With LLVM in Nixpkgs, I discovered there was some technical debt which could
limit the expansion of LLVM. This also would make it more difficult to package new
versions of LLVM. So as a maintainer of LLVM, I made the descision of refactoring all
of the version specific subpackage files for LLVM. This work was split up into 7 pull
requests and was known as the "commonification PR's". My goal was to reduce all the Nix
files responsible for the subpackages in LLVM for each version. This ended up making a
new directory in Nixpkgs inside of the LLVM specific one which ended up being called
"common". Some of this work was already done by [@Artturin](https://github.com/Artturin),
however my work involved every package in LLVM.

Now you may be wondering how this was done. I had to figure out which things were common
between each package in LLVM across each version and limit certain things based on the
version. I ended up using a very useful tool called `nix-diff` made by
[@Gabriella439](https://github.com/Gabriella439). This tool allowed me to get the
differences between my local version of a package and the upstream. I used a very simple
wrapper script so I would only have to do something like
`nix-flake-diff.sh github:NixOS/nixpkgs#llvmPackages_18.clang .#llvmPackages_18.clang`.

With the `nix-flake-diff.sh` script, I was able to see how things deviated to prevent
Nix from rebuilding. Rebuilds were not acceptable as to prevent any unknown bugs from
cropping up and were out of the scope for this project. After 4 days, I was able to
reduce the number of files. Each pull request made for each specific LLVM package ended
up removing about 1,000 LoC and added under 400 LoC. This resulted in
a smaller number of files to manage. It also allows for easily applying changes across
all versions without touching other directories.

Now that it has been more than a month since the pull requests for this project have
been merged, Nixpkgs is nearly ready for the next LLVM version. LLVM 19 will be easier
to package with the number of files to manage is a lot less. Another reason why LLVM 19
and future versions of LLVM will be much easier to package is because of consistent git
updating. I will cover what that entails in the future.
