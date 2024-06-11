---
title: Why upsteaming patches matters
description: The benefits and reasons why you should always upstream patches.
date: 2024-06-10 18:18:00 +0800
categories:
    - nix
---

With packaging software, there will always be cases where software fail to run
or build as expected. This is especially common in Nix where it is not a traditional
Linux/UNIX environment. For example, Nix does not use the filesystem hierarchy (FHS)
which is standard in POSIX. Instead each package has its own directory in the Nix
store, also referred to as a local cache, and contains directories such as `bin`,
`lib`, `share`, etc. As most software is written to expect the FHS, they can easily
break and not run as expected. Due to the Nix store being write-only at build time,
it is essentially immutable afterwards. These factors cause many software ranging
from LLVM to Google Chrome and Flutter to either not build correctly or not
work as intended.

When a patch is required during packaging, it's a good idea to send that patch
to the upstream repository. This helps in both preventing the necessity of the patch
when packaging future versions of the software, and notifying the upstream contributors
that special actions must be taken for a given distro. This offers a collaborative
effort to ensure the software builds in one environment but also other environments as well.
With my efforts with LLVM, we're trying to upstream patches whenever we perform an update
to the git package version of LLVM.

When creating a patch, the easiest way to do it is to utilize the `diff` command from
`diffutils`. Another way is to use `git diff` which git provides, this can be piped to a
file and added into the directory where your package's build files are. Then you can create
a new commit and push to your fork of that software and submit a pull request/merge request.
From there, you can easily communicate to the other contributors and developers of the
package to ensure the patch works as intended and that it is of good quality. This
process may take a while but becomes very collaborative and is often beneficial for
everyone.
