---
title: Scaling workloads
description: The game of scaling jobs on a single CPU system.
date: 2024-06-11 19:25:00 +0800
---

Since the early 2000s, multi-core CPUs have been standard in consumer machines.
The main advantage of multi-core processors is their ability to run tasks in parallel.
If you're not aware, a single CPU core cannot execute multiple instructions simultaneously
(except in CPU's with speculative execution, deep pipelining, or SMT).
Instead, we rely on schedulers that interrupt the current process and switch it out when it's
time for another process to run. However, this method is not entirely optimal, as it can lead
to situations where not all processes get enough time. Nowadays, processors often have core counts
reaching 10 or more. Many smartphones use octocore processors, meaning they effectively have 8
CPUs within a single CPU. This allows you to run 8 processes on 8 cores, potentially giving 100%
execution time to each process if the scheduler permits it. But many of us are not just running 8
processes. Simply booting up a modern OS can result in thousands of processes, though many of these
are short-lived or use minimal resources. In a modern OS, processes typically jump between different
cores, and those requiring more CPU time are given priority. Balancing workloads on a CPU involves
many factors. This post focuses on scaling compiler jobs when using build systems like Ninja, Make, and Nix.

## Binary Optimizations

There are many layers to scaling, and the efficiency of your program plays a significant role.
Different compilers, even for the same language, can result in varying optimizations that affect
runtime performance. All binaries are large without optimizations due to the inclusion of debugging
information. Therefore, it is typical to build programs in "release" mode (using `-O3` in C/C++ compilers).
This mode maximizes optimizations and minimizes debug information. Another useful technique is compiling
with the CPU tune or model set, ensuring the compiler uses the most optimal instructions for the target
CPU. CPUs of different architectures, generations, and manufacturers can vary significantly, affecting
performance even for programs compiled for the same CPU architecture. CPUs execute instructions in a pipeline,
which typically consists of three steps: fetch, decode, and execute. During the fetch stage, the CPU reads
the instruction from memory, usually using the program counter register. On modern systems, the CPU often
reads from its cache. The CPU then decodes the instruction, setting various control signals. Modern CPUs
use microcode to control the timing pulses and control signals. Finally, the CPU executes the instruction,
sending various signals based on the decoded instruction.

Here's an example of how simple programs in x86 assembly can be optimized:

```asm
mov ax, 1
mov bx, 1
add ax, bx
```

This program consists of three instructions: two mov instructions and one add instruction. This
simple program takes three clock cycles to complete. However, it can be optimized further:

```asm
mov ax, 1
add ax, 1
```

Or even more:

```asm
add ax, 1
```

This optimization assumes ax is already 1 before the add instruction, reducing the program to a
single clock cycle. However, this optimization is dangerous as it assumes the CPU state without
checks, potentially leading to incorrect results.

## Workload Size

The size of the workloads, the suitability of the CPU for the workload, and sufficient RAM are
crucial. It's better to have a CPU for a specific architecture rather than cross-compiling, as
this reduces the bootstrap requirements. Having enough RAM depends on the system's typical
usage and the degree of parallelization possible. This distinction will become more apparent as the
world moves from x86 to ARM architecture. ARM is known as a RISC (Reduced Instruction Set Computing)
architecture, while x86 is a CISC (Complex Instruction Set Computing) architecture. x86 has more
instructions, but many are similar to each other. ARM has fewer, more essential instructions, resulting
in less complexity, less heat generation, and reduced thermal throttling. This makes ARM ideal for
laptops and phones. In my experience with a modern ARM processor (Apple M1 Pro), it outperforms an
x86 processor (Ryzen 5 3600 on my desktop). Despite having fewer optimized instructions, having more
CPU cores is beneficial. You can only execute instructions so fast, constrained by the silicon design
and thermal limits. ARM systems typically run cooler and have more cores, allowing them to handle many
processes simultaneously. However, memory remains a critical factor. It's essential to know your workload's
RAM requirements and ensure your system has enough RAM to handle peak usage.
