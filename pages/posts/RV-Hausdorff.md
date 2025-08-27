---
title: Hausdorff测度与维数
date: 2025-08-19
updated: 2025-08-19
categories: 数学 实变
tags:
  - 数学
  - 实变
  - 报告
top: 0
---

[[toc]]

# 引言

## 摘要
本报告旨在探讨Hausdorff测度这一量化集合“大小”的先进工具。鉴于传统Lebesgue测度在处理诸如Cantor集和Koch雪花曲线等具有复杂或“粗糙”几何结构的集合时存在局限性，即这些集合可能具有零Lebesgue测度却仍表现出某种“大小”或“复杂性”，因此引入了Hausdorff测度以提供更精细的量化手段。

Hausdorff测度通过对开集进行精细覆盖来定义，能够为任意非负实数 $s$ 定义 $s-$维测度 $\mathcal{H}^s(E)$。这种灵活性使其不仅能作为Lebesgue测度在整数维度上的自然推广，更重要的是，它在处理分形等非整数维度集合时展现出独特优势，从而揭示集合内在的“分数维度”特性，为分析传统几何工具难以描述的复杂结构提供了强有力的分析框架。报告详细阐述了Hausdorff测度的定义、构建过程及其作为外测度的性质，并探讨了其与Lebesgue测度的关系和归一化问题。此外，报告还引入了Hausdorff维度这一核心概念，它是Hausdorff测度从零变为非零值时的临界点，能够恰当地描述不规则集合的维度特性。报告通过实例计算了不同几何对象的Hausdorff测度，并探讨了Hausdorff维数在分形理论中的应用，包括其与盒维数的关系以及在数学建模中的重要作用。

## 背景
在经典的实变函数论中，Lebesgue测度为我们提供了衡量欧几里得空间 $\mathbb{R}^n$ 中集合“长度”、“面积”或“体积”的强大工具。它在处理规则的几何对象，如区间、矩形或球体时表现出卓越的效能，并构成了Lebesgue积分理论的基石。然而，当面对一些具有高度复杂或“粗糙”几何结构的集合时，Lebesgue测度便显得力不从心。例如，著名的Cantor集在 $\mathbb{R}^1$ 中的Lebesgue测度为零，但我们直观上仍能感受到它具有某种“大小”或“复杂性”；类似的，Koch雪花曲线虽然其Lebesgue测度（即面积）为零，但其边界却是无限长的。这些“零Lebesgue测度”但非空且具有复杂拓扑结构的集合，促使我们寻求一种更为精细的测度理论来对其进行量化。

正是在这样的背景下，Hausdorff测度应运而生。与Lebesgue测度专注于整数维度的“长度”、“面积”与“体积”不同，Hausdorff测度通过一种精细的开集覆盖方式定义，能够对任意非负实数 $s$ 定义 ***s-维测度*** $\mathcal{H}^s(E)$。

这种灵活性使得Hausdorff测度不仅可以作为Lebesgue测度在整数维度上的自然推广，更重要的是在处理分形等非整数维度集合时展现出独特的优势。它能够揭示集合内在的“分数维度”特性，从而为研究那些传统几何工具难以描述的复杂结构提供了有力的分析框架。

# Hausdorff测度

## 定义
**Definition:**
$U$ 是***度量空间 $($X$,\delta)***中任意非空子集, $U$ 的***直径***定义为 $U$ 中一对点的最大距离，即
$$
|U| = \sup\{ |x - y| : x, y \in U \},
$$
如果 $\{U_i\}$ 是一列覆盖$F$的可数 (或有限) 集合簇，他们的最大直径不超过$\delta$ ,即
$$
F \subseteq \bigcup_{i=1}^\infty U_i \quad \forall i \in \mathbb{N} ,  0 < |U_i| \leq \delta
$$
称 $\{U_i\}$ 是 $F$ 的一个 **$\delta$-覆盖**.

**Definition:**
假设 $F$ 是 $($X$,\delta)$ 中的一个集合，$s$ 是一个非负数. $\forall \delta > 0$,定义
$$
\mathcal{H}^s_\delta(F) = \inf \left\{ \sum_{i=1}^\infty |U_i|^s : \{U_i\} \text{ 是 } F \text{的一个 }\delta\text{-覆盖 }  \right\}.
$$

因此，我们要研究 $F$ 的所有覆盖，即直径不超过 $\delta$ 的所有集合。并设法使直径的 $s$ 次幂之和最小. 随着 $\delta$ 减小, (1)中的$F$所允许的覆盖类别也随之减小. 因此，$\mathcal{H}^s_\delta(F)$ 的下确界增大,并且当 $\delta \to 0$的时候趋近极限. 定义 ***Hausdorff测度***为

**Definition [Hausdorff测度]:**
$$
\mathcal{H}^s(F) = \lim_{\delta \to 0} \mathcal{H}^s_\delta(F).
$$
即
$$
\mathcal{H}^s(E) = \lim_{\delta \to 0} \inf \left\{ \sum_{i=1}^{\infty} (\operatorname{diam} U_i)^s : E \subset \bigcup_i U_i,\ \operatorname{diam}(U_i) < \delta \right\}
$$

> **Evans的书 $^ {\cite{ref2}}$ 中在章节引文部分提到一个简单的解释**
> “We introduce next certain “lower dimensional” measures on $\mathbb{R}^n$, which allow us to measure certain “very small” subsets of $\mathbb{R}^n$,These are the Hausdorff measures $\mathcal{H}^s(E)$
>
> 接下来，我们引入 $\mathbb{R}^n$ 的某些“低维”度量，使我们能够测量 $\mathbb{R}^n$ 的某些“非常小”的子集，这就是所谓豪斯多夫测度 $\mathcal{H}^s(E)$
> ”

**Claim:**
我们可以证明上述$\mathcal{H}^s_\delta(F) \text{和} \mathcal{H}^s(F)$ 都是测度（空集零测、次可加）:
**Proof:**
取集合列 $\{A_k\}_{k=1}^\infty \subseteq \mathbb{R}^n$，并假设对每个 $k$，有 $A_k \subseteq \bigcup_{j=1}^\infty C_j^k$ 且 $\operatorname{diam} C_j^k \leq \delta$。则集合族 $\{C_j^k\}_{j,k=1}^\infty$ 覆盖了 $\bigcup_{k=1}^\infty A_k$。因此
$$
\mathcal{H}_\delta^s \left( \bigcup_{k=1}^\infty A_k \right) \leq \sum_{k=1}^\infty \sum_{j=1}^\infty \alpha(s) \left( \frac{\operatorname{diam} C_j^k}{2} \right)^s.
$$
取下确界，可得
$$
\mathcal{H}_\delta^s \left( \bigcup_{k=1}^\infty A_k \right) \leq \sum_{k=1}^\infty \mathcal{H}_\delta^s(A_k) \leq \sum_{k=1}^\infty \mathcal{H}^s(A_k).
$$
令$\delta \to 0$即可。

从而我们可以得到他的两个基本性质：

**Proposition:**
$\mathcal{H}^s(F)$的定义是独立于度量空间的选择的.即对于任意的度量空间 $($X$,\delta)$ , Hausdorff测度 $\mathcal{H}^s(F)$ 是唯一确定的.

**Proposition:**
$\forall s \ge 0 , \delta > 0 , \mathcal{H}^s_\delta(F) $是 $($X$,\delta)$ 上的一个***外测度***，即满足空集测度为 0，单调性和次可加性.类似的，$\mathcal{H}^s(F)$ 也是一个外测度,称其为***Hausdorff外测度***.由这个外测度所确定的(惟一的)测度即为***Hausdorff测度***，仍用$\mathcal{H}^s(F)$表示。

## 性质
Hausdorff测度拥有以下几个性质：
1.  $\mathcal{H}^0$ 是计数测度。
2.  在 $\mathbb{R}^1$ 上，$\mathcal{H}^1$ 等于勒贝格测度 $\mathcal{L}^1$。
3.  对于所有 $s > n$，在 $\mathbb{R}^n$ 上 $\mathcal{H}^s$ 恒等于零。
4.  对任意 $\lambda > 0$ 和子集 $A \subseteq \mathbb{R}^n$，成立 $\mathcal{H}^s(\lambda A) = \lambda^s\mathcal{H}^s(A)$。
5.  对任意仿射等距 $L: \mathbb{R}^n \to \mathbb{R}^n$ 和子集 $A \subseteq \mathbb{R}^n$，成立 $\mathcal{H}^s(L(A)) = \mathcal{H}^s(A)$。

下面我们分别探究他的性质：

**Hausdorff 测度与Lesbegue 测度**

当$s=n=1\text{时，毫无疑问} \mathcal{H}^s_\delta(F) $就是直线上的勒贝格测度；但是当$s=n>1$ 时，$\mathcal{H}^s_\delta(F) $与上的勒贝格测度等价却不完全相同（相差常数系数）。在欧氏空间上，我们有以下结论：

**Corollary:**
在 $\mathbb{R}^n$ 中，有
$$
\mathcal{H}^s(x_0 + F) = \mathcal{H}^s(F), \quad \mathcal{H}^s(\lambda E) = \lambda^s \mathcal{H}^s(F)
$$
其中 $x_0 \in \mathbb{R}^n$，$\lambda > 0$。也即
$$
\mathcal{H}^s(F) = \lambda ^ s \mathcal{H}^s(L_\lambda (F))
$$
其中 $L_\lambda$ 是比例因子为 $\lambda$ 的相似变换。

**Proof:**
若 $\{U_i\}$ 是 $F$ 的一个 $\delta$-覆盖，则 $\{L_\lambda(U_i)\}$ 是 $L_\lambda(F)$ 的一个 $\lambda\delta$-覆盖，因此
$$
\sum |L_\lambda(U_i)|^s = \lambda^s \sum |U_i|^s
$$
从而
$$
\mathcal{H}^s_{\lambda\delta}(L_\lambda(F)) \leq \lambda^s \mathcal{H}^s_{\delta}(F)
$$
（在取下确界后）。令 $\delta \to 0$ 可得 $\mathcal{H}^s(L_\lambda(F)) \leq \lambda^s \mathcal{H}^s(F)$。将 $L_\lambda$ 替换为 $L_\lambda^{-1}$，$\lambda$ 替换为 $1/\lambda$，并将 $F$ 替换为 $L_\lambda(F)$，即得所需的反向不等式。

**Proposition:**
在 $\mathbb{R}^n$ 中，
$$
\alpha_n \mathcal{H}^n(E) = \mathcal{L}^n(E)
$$
其中 $\mathcal{L}^n$ 是 Lebesgue 测度，$\alpha_n$ 为常数系数。

$\bullet$ 通过查找相关资料，发现$\alpha _n$不同的原因是在定义测度时候的**"归一化"(normalization)** 问题:

理解这个问题的核心在于，测度理论中，一个测度的“大小”或“尺度”是可以调整的。就像我们可以用米或厘米来测量长度一样，不同的测度定义可能会导致对同一个集合赋予不同的数值，但它们在比例上是相关的。
*   1. **勒贝格测度的归一化$\mathcal{L}_n$**

    $n$维勒贝格测度 $\mathcal{L}_n$ 是我们对 $\mathbb{R}^n$ 空间中“体积”的直观概念的数学化。它的归一化约定非常标准和自然：
    *   $\bullet$ **单位立方体的体积为 1:**
        这是勒贝格测度最核心的归一化约定。对于 $n$ 维空间 $\mathbb{R}^n$ 中的单位立方体 $Q=[0,1]^n=[0,1]\times [0,1]\times \cdots \times[0,1]$($n$ 个区间的笛卡尔积)，其勒贝格测度定义为：$\mathcal{L}_n(Q) = 1$。
    这个约定直接决定了勒贝格测度的整体尺度。例如，边长为 $a$ 的立方体的勒贝格测度就是 $a^n$ 。这个归一化使得勒贝格测度与我们日常经验中的长度、面积和体积概念直接对应。

*   2. **豪斯多夫测度的定义与隐含的"未归一化"状态$(\mathcal{H}^s)$**

    $s$维豪斯多夫测度 $ \mathcal{H}^s(E) $ 的定义，正如之前提到的，是基于用小直径集合覆盖 $ E $：
    $$
    \mathcal{H}^s(E) = \lim_{\delta \to 0} \inf \left\{ \sum_i (\operatorname{diam}(U_i))^s \right\}
    $$
    其中 $\operatorname{diam}(U_i)$ 是覆盖集 $ U_i $ 的直径。
    *   $\bullet$ **没有明确的"单位体积"参照**: 在豪斯多夫测度的基本定义中，并没有一个像勒贝格测度中"单位立方体测度为1"这样的显式规定。它的数值完全由覆盖集的直径的 $ s $ 次方和的下确界决定。
    *   $\bullet$ **对标准形状的测度值**: 如果我们直接用这个定义去计算 $ \mathbb{R}^n $ 中的 $ n $ 维单位立方体 $ Q $ 的 $ \mathcal{H}^n(Q) $，结果通常不是 1。它会是某个与 $ n $ 相关的常数。同样，计算 $ n $ 维单位球的 $ \mathcal{H}^n $ 测度也不是其标准的勒贝格体积
        $$
        \omega_n = \frac{\pi^{n/2}}{\Gamma\left(\frac{n}{2}+1\right)}.
        $$
    这就是为什么我们说原始定义的豪斯多夫测度相对于勒贝格测度来说是"未归一化"的，或者说它的"自然单位"与勒贝格测度的单位不同。

*   3. **"归一化" 豪斯多夫测度**

    为了使 $ n $ 维豪斯多夫测度在 $\mathbb{R}^n $ 空间中与 $ n $ 维勒贝格测度直接可比，甚至在数值上相等，就需要对豪斯多夫测度进行``归一化''。这通常意味着：
    在豪斯多夫测度的原始定义前乘以一个特定的常数因子，使得这个""归一化后"的豪斯多夫测度作用于 $\mathbb{R}^n $ 中的标准几何体（如单位立方体或单位球）时，其结果与勒贝格测度一致。

    具体来说，如果我们希望归一化后的 $ n $ 维豪斯多夫测度 $ \mathcal{H}_{\text{norm}}^n $ 满足 $ \mathcal{H}_{\text{norm}}^n(E) = \mathcal{L}^n(E) $ 对于所有 $ E \subset \mathbb{R}^n $ 的博雷尔集成立，那么我们需要找到一个常数 $ \beta_n $ 使得：
    $$
    \mathcal{H}_{\text{norm}}^n(E) = \beta_n \mathcal{H}^n(E)
    $$
    并且 $ \beta_n \mathcal{H}^n(Q) = \mathcal{L}^n(Q) = 1 $ (其中 $ Q $ 是单位立方体)。
    这个常数 $ \beta_n $ 就被称为归一化常数。

*   4. **常数因子的具体形式与来源**

    如前所述，$ \mathcal{L}^n(A) = \alpha_n \mathcal{H}^n(A) $，其中 $ \mathcal{H}^n $ 指的是未归一化的、基于直径定义的豪斯多夫测度。这个常数 $ \alpha_n $ 的值是：
    $$
    \alpha_n = \frac{\omega_n}{2^n} = \frac{\pi^{n/2}}{2^n \Gamma\left(\frac{n}{2}+1\right)}
    $$
    这里：
    *   $\bullet$ $ \omega_n = \dfrac{\pi^{n/2}}{\Gamma\left(\frac{n}{2}+1\right)} $ 是 $ n $ 维单位球的勒贝格体积（即半径为 1 的球）。
    *   $\bullet$ $ 2^n $ 的出现与豪斯多夫测度定义中使用的是直径 (diameter) 而不是半径 (radius) 有关。一个直径为 $ d $ 的球，其半径为 $ d/2 $。
    这就是说，未归一化的 $n$ 维豪斯多夫测度会把 $n$ 维球的“体积”测量为 (直径) $ ^ n$，而勒贝格测度测量为 $\omega ^ n $, (半径) $^ n$。常数$\alpha ^ n$就是这两个测量方式之间的转换因子。

了解了这之后，我们认为两种测度是相等的。下面给出一个证明

**Proof:**
一方面
$$
\begin{aligned}
\mathcal{L}^1(A)
 & = \inf \left\{ \sum_{j=1}^{\infty} \operatorname{diam} C_j \mid A \subset \bigcup_{j=1}^{\infty} C_j \right\} \\
 & \leq \inf \left\{ \sum_{j=1}^{\infty} \operatorname{diam} C_j \mid A \subset \bigcup_{j=1}^{\infty} C_j,\ \operatorname{diam} C_j \leq \delta \right\} \\
 & = \mathcal{H}_\delta^1(A).
\end{aligned}
$$
令 $\delta \to 0$ 有 $\mathcal{L}^1 \leq \mathcal{H}^1$.

另一方面

对于固定的 $\delta$, 令 $I_k := [k\delta, (k+1)\delta]$, 注意到
$$
\sum_{k=-\infty}^{\infty} \operatorname{diam} (C_j \cap I_k) \leq \operatorname{diam} C_j.
$$
因而
$$
\begin{aligned}
\mathcal{L}^1(A)
 & = \inf \left\{ \sum_{j=1}^{\infty} \operatorname{diam} C_j \mid A \subset \bigcup_{j=1}^{\infty} C_j \right\} \\
 & \geq \inf \left\{ \sum_{j=1}^{\infty} \sum_{k=-\infty}^{\infty} \operatorname{diam} (C_j \cap I_k) \mid A \subset \bigcup_{j=1}^{\infty} C_j \right\} \\
 & \geq \mathcal{H}_\delta^1(A).
\end{aligned}
$$
令 $\delta \to 0$ 有 $\mathcal{L}^1 \geq \mathcal{H}^1$.

这说明 Hausdorff 测度 是 Lebesgue 测度 在度量空间中的推广。

***严谨具体的证明在Evans书中87-92页 \cite{ref2} 给出***

实际上，我们可以证明$\mathcal{H}^n(E)$是一个Borel正则测度\cite{ref2}(定义如下)
> *   1)
>     A measure $\mu$ on $\mathbb{R}^n$ is called ***Borel*** if each Borel set is $\mu$ measurable.
> *   2)
>     A measure $\mu$ on $\mathbb{R}^n$ is ***Borel regular*** if ? is Borel and for each $A \subseteq \mathbb{R}^n$ there exists a Borel set $B$ such that $A \subseteq B$ and $\mu(A)$ = $\mu(B)$.

**Proof:**
*   Step 1
    $\mathcal{H}^s_\delta(F) \text{和} \mathcal{H}^s(F)$ 测度 (已证明)

*   Step 2
    $\mathcal{H}^s(F)$是$Borel$测度

    取集合 $A, B \subseteq \mathbb{R}^n$ 满足 $\operatorname{d}(A, B) > 0$。选择 $0 < \delta < \frac{1}{4}\operatorname{d}(A, B)$。假设 $A \cup B \subseteq \bigcup_{k=1}^{\infty} C_k$ 且 $\operatorname{diam} C_k \leq \delta$。

    令 $\mathcal{A} := \{ C_j \mid C_j \cap A \neq \emptyset \}$，$\mathcal{B} := \{ C_j \mid C_j \cap B \neq \emptyset \}$。则 $A \subseteq \bigcup_{C_j \in \mathcal{A}} C_j$，B $\subseteq \bigcup_{C_j \in \mathcal{B}} C_j$，且当 $C_i \in \mathcal{A}, C_j \in \mathcal{B}$ 时，有 $C_i \cap C_j = \emptyset$。因此
    $$
    \sum_{j=1}^{\infty} \alpha(s) \left( \frac{\operatorname{diam} C_j}{2} \right)^s \geq \sum_{C_j \in \mathcal{A}} \alpha(s) \left( \frac{\operatorname{diam} C_j}{2} \right)^s + \sum_{C_j \in \mathcal{B}} \alpha(s) \left( \frac{\operatorname{diam} C_j}{2} \right)^s
    $$
    $$
    \geq \mathcal{H}^s_\delta(A) + \mathcal{H}^s_\delta(B).
    $$
    对所有满足条件的覆盖集 $\{C_j\}_{j=1}^{\infty}$ 取下确界，得到 $\mathcal{H}^s_\delta(A \cup B) \geq \mathcal{H}^s_\delta(A) + \mathcal{H}^s_\delta(B)$，其中 $0 < 4\delta < \operatorname{d}(A, B)$。令 $\delta \to 0$，可得 $\mathcal{H}^s(A \cup B) \geq \mathcal{H}^s(A) + \mathcal{H}^s(B)$。因此，
    $$
    \mathcal{H}^s(A \cup B) = \mathcal{H}^s(A) + \mathcal{H}^s(B)
    $$
    对所有满足 $\operatorname{d}(A, B) > 0$ 的集合 $A, B \subseteq \mathbb{R}^n$ 成立。故由 Caratheodory 准则可知，$\mathcal{H}^s$ 是一个 Borel 测度。

*   Step 3
    $\mathcal{H}^s$ 是 $Borel$ 正则测度

    注意到：对任意集合 $C$，有 $\operatorname{diam} \bar{C} = \operatorname{diam} C$；因此
    $$
    \mathcal{H}^s_\delta(A) = \inf \left\{ \sum_{j=1}^{\infty} \alpha(s) \left( \frac{\operatorname{diam} C_j}{2} \right)^s \mid A \subseteq \bigcup_{j=1}^{\infty} C_j, \operatorname{diam} C_j \leq \delta, C_j \text{ 为闭集} \right\}.
    $$
    取集合 $A \subseteq \mathbb{R}^n$ 满足 $\mathcal{H}^s(A) < \infty$，则对任意 $\delta > 0$，有 $\mathcal{H}^s_\delta(A) < \infty$。对每个 $k \geq 1$，选择闭集 $\{C_j^k\}_{j=1}^{\infty}$ 使得 $\operatorname{diam} C_j^k \leq \frac{1}{k}$，$A \subseteq \bigcup_{j=1}^{\infty} C_j^k$，且
    $$
    \sum_{j=1}^{\infty} \alpha(s) \left( \frac{\operatorname{diam} C_j^k}{2} \right)^s \leq \mathcal{H}^s_{\frac{1}{k}}(A) + \frac{1}{k}.
    $$
    令 $ A_k := \bigcup_{j=1}^\infty C_j^k $，$ B := \bigcap_{k=1}^\infty A_k $；则 $ B $ 是 Borel 集。且对每个 $ k $，有 $ A \subseteq A_k $，因此 $ A \subseteq B $。此外，
    $$
    \mathcal{H}^s_{\frac{1}{k}}(B) \leq \sum_{j=1}^\infty \alpha(s) \left( \frac{\operatorname{diam} C_j^k}{2} \right)^s \leq \mathcal{H}^s_{\frac{1}{k}}(A) + \frac{1}{k}.
    $$
    令 $ k \to \infty $，可得 $ \mathcal{H}^s(B) \leq \mathcal{H}^s(A) $。但 $ A \subseteq B $，因此
    $$
    \mathcal{H}^s(A) = \mathcal{H}^s(B).
    $$

下面我们正式给出五条性质的证明
1.  $\mathcal{H}^0$ 是计数测度。
2.  在 $\mathbb{R}^1$ 上，$\mathcal{H}^1$ 等于勒贝格测度 $\mathcal{L}^1$。
3.  对于所有 $s > n$，在 $\mathbb{R}^n$ 上 $\mathcal{H}^s$ 恒等于零。
4.  对任意 $\lambda > 0$ 和子集 $A \subseteq \mathbb{R}^n$，成立 $\mathcal{H}^s(\lambda A) = \lambda^s\mathcal{H}^s(A)$。
5.  对任意仿射等距 $L: \mathbb{R}^n \to \mathbb{R}^n$ 和子集 $A \subseteq \mathbb{R}^n$，成立 $\mathcal{H}^s(L(A)) = \mathcal{H}^s(A)$。

**Proof:**
1.  性质 (iv) 和 (v) 的证明是直接的且已经给出。
2.  首先注意到 $\alpha(0) = 1$。因此显然对所有 $a \in \mathbb{R}^n$ 有 $\mathcal{H}^0(\{a\}) = 1$，故 (i) 得证。
3.  取子集 $A \subseteq \mathbb{R}^1$ 和 $\delta > 0$，则有
    $$
    \begin{aligned}
    \mathcal{L}^1(A)
     & = \inf \left\{ \sum_{j=1}^{\infty} \mathrm{diam}\, C_j \mid A \subseteq \bigcup_{j=1}^{\infty} C_j \right\}\\
     & \leq \inf \left\{ \sum_{j=1}^{\infty} \mathrm{diam}\, C_j \mid A \subseteq \bigcup_{j=1}^{\infty} C_j,\ \mathrm{diam}\, C_j \leq \delta \right\}\\
     & = \mathcal{H}_\delta^1(A),
    \end{aligned}
    $$
    其中 $\Gamma(\frac{3}{2}) = \frac{\sqrt{\pi}}{2}$ 蕴涵 $\alpha(1) = 2$。因此 $\mathcal{L}^1(A) \leq \mathcal{H}^1(A)$。
    另一方面，令 $I_k := [k\delta, (k+1)\delta]$（$k \in \mathbb{Z}$）。则有 $\mathrm{diam}(C_j \cap I_k) \leq \delta$ 且
    $$
    \sum_{k=-\infty}^{\infty} \mathrm{diam}(C_j \cap I_k) \leq \mathrm{diam}\, C_j.
    $$
    因此
    $$
    \begin{aligned}
    \mathcal{L}^1(A)
     & = \inf \left\{ \sum_{j=1}^{\infty} \mathrm{diam}\, C_j \, \middle| \, A \subseteq \bigcup_{j=1}^{\infty} C_j \right\}\\
     & \geq \inf \left\{ \sum_{j=1}^{\infty} \sum_{k=-\infty}^{\infty} \mathrm{diam}(C_j \cap I_k) \, \middle| \, A \subseteq \bigcup_{j=1}^{\infty} C_j \right\}\\
     & \geq \mathcal{H}_\delta^1(A).
    \end{aligned}
    $$
    综上，对所有 $\delta > 0$ 有 $\mathcal{L}^1 = \mathcal{H}_\delta^1$，故在 $\mathbb{R}^1$ 上 $\mathcal{L}^1 = \mathcal{H}^1$。
4.  固定整数 $m \geq 1$。$\mathbb{R}^n$ 中的单位立方体 $Q$ 可分解为 $m^n$ 个边长为 $\frac{1}{m}$、直径为 $\frac{\sqrt{n}}{m}$ 的小立方体。因此
    $$
    \mathcal{H}_{\frac{\sqrt{n}}{m}}^s(Q) \leq \sum_{i=1}^{m^n} \alpha(s) \left( \frac{\sqrt{n}}{m} \right)^s = \alpha(s) n^{\frac{s}{2}} m^{n-s},
    $$
    当 $s > n$ 时，上式随 $m \to \infty$ 趋于零。故 $\mathcal{H}^s(Q) = 0$，从而 $\mathcal{H}^s(\mathbb{R}^n) = 0$。

**Proposition:**
缩放特性（Corollary 1.2.1. 的推广）

设 $ F \subset \mathbb{R}^n $ 且 $ f : F \to \mathbb{R}^m $ 是满足以下条件的映射：
$$
|f(x) - f(y)| \leq c|x - y|^{\alpha} \quad (x, y \in F)
$$
其中常数 $ c > 0 $ 且 $ \alpha > 0 $。则对每个 $ s $ 有：
$$
\mathcal{H}^{s/\alpha}(f(F)) \leq c^{s/\alpha}\mathcal{H}^s(F).
$$

**Proof:**
若 $\{U_i\}$ 是 $F$ 的 $\delta$-覆盖，则由条件
$$
|f(F \cap U_i)| \leq c|F \cap U_i|^{\alpha} \leq c|U_i|^{\alpha},
$$
可知 $\{f(F \cap U_i)\}$ 构成 $f(F)$ 的 $\varepsilon$-覆盖，其中 $\varepsilon = c\delta^{\alpha}$。因此
$$
\sum_i |f(F \cap U_i)|^{s/\alpha} \leq c^{s/\alpha} \sum_i |U_i|^s,
$$
即 $\mathcal{H}^{s/\alpha}_\varepsilon(f(F)) \leq c^{s/\alpha}\mathcal{H}^s_\delta(F)$。当 $\delta \to 0$ 时 $\varepsilon \to 0$，即得所求不等式。

条件 (\ref{holder}) 称为指数 $\alpha$ 的**H?lder 条件**，该条件蕴含 $f$ 的连续性。特别重要的是 $\alpha = 1$ 的情形，即
$$
|f(x) - f(y)| \leq c|x - y| \quad (x, y \in F),
$$
此时 $f$ 称为**Lipschitz 映射**，且成立
$$
\mathcal{H}^s(f(F)) \leq c^s\mathcal{H}^s(F).
$$
特别地，(\ref{2.9})式对任意具有有界导数的可微函数均成立：此类函数由中值定理必为 Lipschitz 映射。若 $f$ 是等距映射（即 $|f(x) - f(y)| = |x - y|$），则
$$
\mathcal{H}^s(f(F)) = \mathcal{H}^s(F).
$$
因此，Hausdorff 测度具有平移不变性（即 $\mathcal{H}^s(F + z) = \mathcal{H}^s(F)$，其中 $F + z = \{x + z : x \in F\}$)) 和旋转不变性，这完全符合理论预期。

# Hausdorff维度

## 定义
从直觉上来说一个集合的维数是描述这个集合中一点所需的独立参数的个数。比如要描述一个平面里的一点我们需要两个坐标x和y，那么平面的维数便是2。最接近这个想法的数学模型是拓扑维度。可以预见拓扑维度必然是一个自然数。但是拓扑维度在描述某些不规则的集合比如分形的时候遭遇到了困难，而豪斯多夫维数则是一个描述该种集合的恰当工具。

设想有一个由三维空间内具有有限大小的点组成的集合，$N$是用来覆盖这个集合内所有点所需的半径为$R$的球体的最少个数，则这个最小数$N$是$R$的一个函数，记作$N(R)$。显然$R$越小则$N$越大，假设$N(R)$和$R^d$之间存在一个反比的关系，我们把这个关系记作
$$
N(R) \sim \frac{1}{R^d}
$$
当$R$趋向于$0$时, 我们得到
$$
d = - \lim_{R \to 0} \log_R N
$$
这里的$d$就是这个集合的**Hausdorff维数**

下面我们考虑方体的覆盖：
对于一维单位方体$Q_1$(即长度为1的闭区间)，当我们用长度为$\frac{1}{2}$的线段盖住时，很容易知道需要2个；长度为$\frac{1}{4}$时需要4个。倘若以这种覆盖方式作为下确界，粗略的说 $ \mathcal{H}_\delta^s(Q_1) \approx \left(\frac{1}{\delta}\right)^s * \delta $，当我们考虑 $\delta \to 0$ 时，当 $s = 1$ 时可能会是一个数字，而 $s < 1$ 必定是趋于无穷，$s > 1$ 时必定趋于 0。

而这一特性是嵌入不变的，具体来说，如果这个闭区间嵌入了二维平面，下面考虑用二维方体覆盖它，为了方便不妨只考虑与坐标轴平行的方体，我们会发现，用 $\frac{1}{2}$ 边长的二维正方体盖住时，需要两个；用 $\frac{1}{4}$ 边长的二维正方体盖住时，需要 4 个，所以在二维空间中思考，仍有 $ \mathcal{H}_\delta^s(Q_1) \approx \left(\frac{1}{\delta}\right)^s * \delta $，同样的 $s = 1$ 是一个分界线。

但是在二维空间中去考察单闭正方形，则用 $\frac{1}{2}$ 边长的二维正方体盖住时，需要 4 个；用 $\frac{1}{4}$ 边长的二维正方体盖住时，需要 16 个，所以 $ \mathcal{H}_\delta^s(Q_1) \approx \left(\frac{1}{\delta}\right)^s * (\delta)^2 $，我们会发现此时分界线变成了 $s = 2$。

这说明了一个重要的性质，Hausdorff 测度里的指标 $s$ 有某个分界点，而这个分界点反映了集合的维数，且与我们对于维数的直觉相符。

有了以上探究我们就可以得到 Hausdorff 测度的**分界点**性质：设 $ A \subset \mathbb{R}^n $ 为任意集合，$ 0 \leq s < t < \infty $，则：
1.  若 $ \mathcal{H}^s(A) < \infty $，则 $ \mathcal{H}^t(A) = 0 $。
2.  若 $ \mathcal{H}^t(A) > 0 $，则 $ \mathcal{H}^t(A) = +\infty $。
有了这个刻画，我们知道分界点是真的存在的，即对 $ \forall A \subset \mathbb{R}^n $ 存在一个指标 $ s_0 $ 使得 $ s > s_0 $ 时 $ \mathcal{H}^s(A) = 0$; $ s < s_0 $ 时 $ \mathcal{H}^s(A) = +\infty $。我们定义为 Hausdorff 维数。

**Definition:**
对于任意集合 $ A \subset \mathbb{R}^n $，其*Hausdorff*维数定义为：
$$
\operatorname{dim}_{\mathcal{H}}(A) := \inf\{0 \leq s < \infty \mid \mathcal{H}^s(A) = 0\}
$$

**Remark:**
至于正好在分界点 $ s_0 $ 处的*Hausdorff*测度，实际上不一定是一个非零有限数，$\mathcal{H}^{s_0}(A)$ 可以是 0、非零有限数，或者 $+\infty$。

这种维数与空间维数（作为向量空间的维数）之间的关系也是符合直觉的。

**Proposition [集合维数不大于其空间维数]:**
对于任意 $ s > n $，在 $\mathbb{R}^n$ 上有 $\mathcal{H}^s = 0$。

**Proof:**
考察单位立方体即可。设 $ Q $ 为单位立方体，可被分解为 $ m^n $ 个边长为 $ \frac{1}{m} $ 的小立方体。以此分解作为 $ Q $ 的覆盖，有估计式：
$$
\mathcal{H}_{\frac{\sqrt{n}}{m}}^s(Q) \leq \sum_{i=1}^{m^n} \alpha(s) \left( \frac{\sqrt{n}}{m} \right)^s = \alpha(s) n^{\frac{s}{2}} m^{n-s}.
$$
令 $ m \to \infty $，即得结论。

通常对Hausdorff维数严格定义如下：
**Definition:**
Hausdorff维数（又叫 Hausdorff–Besicovitch dimension）被定义为豪斯多夫外测度从零变为非零值跳跃点对应的$s$值。即
$$
\dim_H(E) = \inf \{ s : H^s(E) = 0 \} = \sup \{ s : H^s(E) = \infty \}
$$

## 性质
**Proposition [单调性]:**
若 $ E \subset F $，则 $\dim_H E \leq \dim_H F$。
**Proof:**
这直接源于测度性质：对每个 $ s $ 有 $\mathcal{H}^s(E) \leq \mathcal{H}^s(F)$。

**Proposition [可数稳定性]:**
若 $ F_1, F_2, \ldots $ 是可数集合序列，则
$$
\dim_H \bigcup_{i=1}^{\infty} F_i = \sup_{1 \leq i < \infty} \{\dim_H F_i\}
$$
**Proof:**
由单调性，对每个 $ j $ 有 $\dim_H \bigcup_{i=1}^{\infty} F_i \geq \dim_H F_j$。
另一方面，若对所有 $ i $ 有 $ s > \dim_H F_i $，则 $\mathcal{H}^s(F_i) = 0$，故 $\mathcal{H}^s(\bigcup_{i=1}^{\infty} F_i) = 0$，得到反向不等式。

**Proposition [可数集]:**
若 $ F $ 可数，则 $\dim_H F = 0$。
**Proof:**
因为若 $ F_i $ 是单点集，则 $\mathcal{H}^0(F_i) = 1$ 且 $\dim_H F_i = 0$，由可数稳定性得 $\dim_H \bigcup_{i=1}^{\infty} F_i = 0$。

**Proposition [开集]:**
若 $ F \subset \mathbb{R}^n $ 是开集，则 $\dim_H F = n$。
**Proof:**
因 $ F $ 包含一个具有正 $ n $ 维体积的球，故 $\dim_H F \geq n$；
又因 $ F $ 包含于可数个球中，由可数稳定性与单调性得 $\dim_H F \leq n$。

**Proposition [光滑集]:**
若 $ F $ 是 $\mathbb{R}^n$ 中的光滑（即连续可微）$ m $ 维子流形（即 $ m $ 维曲面），则 $\dim_H F = m$。
特别地，光滑曲线的维数为 1，光滑曲面的维数为 2。

Hausdorff 维数的变换性质可直接由命题 2.2 给出的 Hausdorff 测度的相应性质导出。

**Proposition:**
设 $ F \subset \mathbb{R}^n $，且映射 $ f : F \to \mathbb{R}^m $ 满足 H?lder 条件：
$$
|f(x) - f(y)| \leq c|x - y|^{\alpha} \quad (x, y \in F).
$$
则 $\dim_H f(F) \leq \dfrac{1}{\alpha} \dim_H F$。

**Proof:**
若 $ s > \dim_H F $，则由命题 2.2 有：
$$
\mathcal{H}^{s/\alpha}(f(F)) \leq c^{s/\alpha}\mathcal{H}^s(F) = 0,
$$
这表明对所有 $ s > \dim_H F $ 成立 $\dim_H f(F) \leq s/\alpha$。

**Proposition:**
设 $ F \subset \mathbb{R}^n $ 满足 $\dim_H F < 1$，则 $ F $ 是**完全不连通**的。

**Proof:**
设 $ x $ 和 $ y $ 是 $ F $ 中两个不同的点。定义映射 $ f : \mathbb{R}^n \to [0, \infty) $ 为 $ f(z) = |z - x| $。由于 $ f $ 不增大距离（因为 $ |f(z) - f(w)| = \left| |z - x| - |w - x| \right| \leq |(z - x) - (w - x)| = |z - w| $），由推论 2.4(a) 可得：
$$
\dim_H f(F) \leq \dim_H F < 1.
$$
因此 $ f(F) $ 是 $\mathbb{R}$ 的子集，其 $\mathcal{H}^1$-测度（即长度）为零，故其补集稠密。选取 $ r $ 满足 $ r \notin f(F) $ 且 $ 0 < r < f(y) $，则有：
$$
F = \{ z \in F : |z - x| < r \} \cup \{ z \in F : |z - x| > r \}.
$$
这表明 $ F $ 包含在两个不相交的开集中，其中一个包含 $ x $，另一个包含 $ y $，故 $ x $ 和 $ y $ 位于 $ F $ 的不同连通分支中。

## Hausdorff测度的计算示例
1.  例1
    设 $ F $ 是 $\mathbb{R}^3$ 中单位半径的平坦圆盘。根据长度、面积和体积的熟知性质：
    $$
    \mathcal{H}^1(F) = \text{长度}(F) = \infty, \quad
    0 < \mathcal{H}^2(F) = \frac{4}{\pi} \times \text{面积}(F) = 4 < \infty, \quad
    \mathcal{H}^3(F) = \frac{6}{\pi} \times \text{体积}(F) = 0.
    $$
    因此 $\dim_H F = 2$，且当 $ s < 2 $ 时 $\mathcal{H}^s(F) = \infty$，当 $ s > 2 $ 时 $\mathcal{H}^s(F) = 0$.

2.  例2
    设 $ F $ 为如图 1 所示从单位正方形构造的 **Cantor 尘埃**。（在构造的每个阶段，正方形被划分为 16 个边长为四分之一的小正方形，并保留相同模式的四个正方形。）则有 $ 1 \leq \mathcal{H}^1(F) \leq \sqrt{2} $，故 $\dim_H F = 1$。

    **Calculation:**
    观察构造的第 $ k $ 阶段 $ E_k $，它由 $ 4^k $ 个边长为 $ 4^{-k} $ 的正方形组成，直径为 $ 4^{-k} \sqrt{2} $。取 $ E_k $ 中的正方形作为 $ F $ 的 $\delta$-覆盖（其中 $\delta = 4^{-k} \sqrt{2}$))，我们得到下确界估计：
    $$
    \mathcal{H}_\delta^1(F) \leq 4^k \cdot 4^{-k} \sqrt{2} = \sqrt{2}.
    $$
    当 $ k \to \infty $ 时 $\delta \to 0$，即得 $\mathcal{H}^1(F) \leq \sqrt{2}$. 对于下界估计，令 $\operatorname{proj}$ 表示到 $ x $-轴的正交投影。正交投影不增大距离（即对任意 $ x, y \in \mathbb{R}^2 $ 有 $ |\operatorname{proj} x - \operatorname{proj} y| \leq |x - y| $))，故 $\operatorname{proj}$ 是 Lipschitz 映射。根据 $ F $ 的构造，其在 $ x $-轴上的投影（即"阴影"）$\operatorname{proj} F$ 是单位区间 $[0, 1]$。由 (2.9) 式：
    $$
    1 = \operatorname{length}[0, 1] = \mathcal{H}^1([0, 1]) = \mathcal{H}^1(\operatorname{proj} F) \leq \mathcal{H}^1(F).
    $$

    **Figure 1: 单位正方形构造的Cantor尘埃**

3.  例3
    设 $ F $ 为三分 Cantor 集（见图 0.1）。若 $ s = \log 2 / \log 3 = 0.6309 \ldots $，则 $\dim_H F = s$ 且 $\frac{1}{2} \leq \mathcal{H}^s(F) \leq 1$.
    **Heuristic:**
    Cantor 集 $ F $ 可分为左半部分 $ F_L = F \cap [0, \frac{1}{3}] $ 和右半部分 $ F_R = F \cap [\frac{2}{3}, 1] $。显然这两部分几何相似于 $ F $ 但缩放比例为 $\frac{1}{3}$，且 $ F = F_L \cup F_R $ 为无交并。因此对任意 $ s $：
    $$
    \mathcal{H}^s(F) = \mathcal{H}^s(F_L) + \mathcal{H}^s(F_R) = \left(\frac{1}{3}\right)^s\mathcal{H}^s(F) + \left(\frac{1}{3}\right)^s\mathcal{H}^s(F)
    $$
    由 Hausdorff 测度的缩放性质（性质 2.1）。假设在临界值 $ s = \dim_H F $ 处有 $ 0 < \mathcal{H}^s(F) < \infty $（这是一个强假设但可被验证），两边除以 $\mathcal{H}^s(F)$ 得 $ 1 = 2(\frac{1}{3})^s $，即 $ s = \log 2/\log 3 $。

    **Rigorous Calculation:**
    在 $ F $ 的构造中，称组成集合 $ E_k $ 的区间为第 $ k $ 层区间。因此 $ E_k $ 包含 $ 2^k $ 个长度为 $ 3^{-k} $ 的第 $ k $ 层区间。

    取 $ E_k $ 中的区间作为 $ F $ 的 $ 3^{-k} $-覆盖，当 $ s = \log 2/\log 3 $ 时：
    $$
    \mathcal{H}_{3^{-k}}^s(F) \leq 2^k \cdot 3^{-ks} = 1.
    $$
    令 $ k \to \infty $ 得 $\mathcal{H}^s(F) \leq 1$. 为证 $\mathcal{H}^s(F) \geq \frac{1}{2}$，需证对 $ F $ 的任意覆盖 $\{U_i\}$ 有：
    $$
    \sum |U_i|^s \geq \frac{1}{2} = 3^{-s} \tag{2.14}
    $$
    只需假设 $\{U_i\}$ 为区间，通过略微扩大区间并利用 $ F $ 的紧性，仅需验证当 $\{U_i\}$ 是 [0,1] 的有限闭子区间集时 (2.14) 成立。对每个 $ U_i $，取整数 $ k $ 满足：
    $$
    3^{-(k+1)} \leq |U_i| < 3^{-k}. \tag{2.15}
    $$
    则 $ U_i $ 至多与一个第 $ k $ 层区间相交（因这些区间间距至少 $ 3^{-k} $))。若 $ j \geq k $，由构造及 (2.15)，$ U_i $ 至多与 $ 2^{j-k} = 2^{j-3k} \leq 2^{j-3s}|U_i|^s $ 个 $ E_j $ 的第 $ j $ 层区间相交。取足够大的 $ j $ 使得对所有 $ U_i $ 有 $ 3^{-(j+1)} \leq |U_i| $，则因 $\{U_i\}$ 覆盖所有 $ 2^j $ 个长度为 $ 3^{-j} $ 的基本区间，计数得：
    $$
    2^j \leq \sum_i 2^{j-3s}|U_i|^s
    $$
    化简即得 (2.14)。

**计盒维数：**一种常用的覆盖方法，把一个分形图案放在一个均匀分割的网格上，数一数最小需要几个格子来覆盖这个分形。通过对网格的逐步精化，使格子的边长不断逼近于0，查看所需覆盖数目的变化，从而计算出计盒维数。计盒维数与豪斯多夫维数的关系计盒维数与豪斯多夫维数的关系为
$$
\dim_H F \leq \underline{\dim}_B F \leq \overline{\dim}_B F
$$
豪斯多夫维数是不容易直接计算的，一般的可以通过计盒维数（Box-counting dimension）估计到它的一个上界，而且可以通过局部维数（点维数，Local dimension）估计到它的一个下界。一般情况下，我们可以认为计盒维数近似等于豪斯多夫维数。
他使得我们可以用计算的方法逼近求解豪斯多夫维数，python代码示例：

```python
import numpy as np
import matplotlib.pyplot as plt

image = np.zeros((512, 512))
image[200:300, 200:300] = 1

def fractal_box_count(image, min_size=4, max_size=None, step=2):
    shape = image.shape
    if max_size is None:
        max_size = min(shape, shape)
    x, y = np.where(image == 1)
    points = np.column_stack((x, y))
    count = []
    scales = []
    for size in range(min_size, max_size + 1, step):
        scales.append(size)
        boxes = np.ceil(shape / size) * np.ceil(shape / size)
        if boxes == 0:
            count.append(0)
            continue
        counts = np.zeros(
            (int(np.ceil(shape / size)), int(np.ceil(shape / size)))
        )
        for point in points:
            i, j = np.floor(point / size).astype(int)
            counts[i, j] = 1
        count.append(np.sum(counts > 0))
    return np.array(count), np.array(scales)

count, scales = fractal_box_count(image)

plt.plot(np.log(scales), np.log(count), "bo-")
plt.xlabel("log(Grid Size)")
plt.ylabel("log(Box Count)")
plt.title("Fractal Box Counting")
plt.show()
```

# 分形的相关内容

## **分形的基本概念**
“分形”（Fractal）一词由数学家本诺·曼德勃罗特（Beno?t B. Mandelbrot）于20世纪70年代提出，用于描述那些具有自相似性、不规则性、复杂结构，且在传统欧几里得几何中难以刻画的图形。分形广泛存在于自然界中，如海岸线的曲折、雪花的纹理、树枝的分叉、云的轮廓等，具有以下几个基本特征：
*   **自相似性（Self-similarity）**：分形对象在不同尺度下具有相似的局部结构。自相似可以是严格的（如康托集、谢尔宾斯基三角形）或统计意义上的（如自然地形）。
*   **无限细节（Infinite detail）**：分形在任意放大倍数下都显示出结构的复杂性。
*   **非整数维数（Fractal dimension）**：传统几何维数（如点的维数为0，线为1，面为2）无法描述分形的复杂程度，必须引入更一般的维数概念。

## 分形维数与Hausdorff维数
为了刻画分形集合的复杂度，数学家们提出了多种维数的定义，其中最为核心和精确的就是**Hausdorff维数**。与更直观的盒维数（box-counting dimension）相比，Hausdorff维数基于严格的测度理论，能更准确地反映集合的结构特性。

Hausdorff维数不仅适用于分形集合，也能应用于任意度量空间中的子集。它是通过Hausdorff测度定义的一种临界维数，具体表示为：
$$
\dim_H(E) = \inf\left\{ s \geq 0 : \mathcal{H}^s(E) = 0 \right\} = \sup\left\{ s \geq 0 : \mathcal{H}^s(E) = \infty \right\}
$$
对许多典型的分形集合来说，其Hausdorff维数为非整数，且与直观观察到的复杂程度相一致。例如：
*   康托集的Hausdorff维数为 $\log 2 / \log 3 \approx 0.6309$；
*   谢尔宾斯基三角形的Hausdorff维数为 $\log 3 / \log 2 \approx 1.5849$。
这些例子说明，Hausdorff维数可以有效地将“复杂但有结构”的几何对象进行量化，超越了传统几何的整数维框架。

## Hausdorff测度与分形的数学建模
分形理论中的许多研究目标，尤其是在自然科学、图像处理、动力系统等领域，常依赖于对几何结构的精确度量与分析。Hausdorff测度为此提供了一个严密的工具：
*   能在任意维度下对集合“大小”进行精细的刻画；
*   能区分不同分形在同一欧几里得空间中所具有的细节结构；
*   是刻画分形维数的基础，在理论分形研究中不可或缺。
例如，在研究Julia集、Mandelbrot集、布朗运动路径等自然或数学生成的复杂结构时，Hausdorff维数作为衡量其“分形性”的核心指标，为进一步分析其动力学、概率行为等提供了理论基础。

---

**BIBLIOGRAPHY**

*   [1] FALCONER K. *Fractal Geometry: Mathematical Foundations and Applications* [M]. 2nd ed. Chichester: John Wiley & Sons, 2003.
*   [2] EVANS L.C. & GARIEPY R.F. *Measure Theory and Fine Properties of Functions* [M]. Revised ed. Berkeley: CRC Press, 2015: 81-100
*   [3] 飞雨烟雁. 分析专题选讲(1)：Hausdorff测度与维数[EB/OL]. 知乎专栏.[2023-10-20].https://zhuanlan.zhihu.com/p/30507920934
*   [4]王经民. 正四面体生成的Sierpinski块的Hausdorff测度[J]. 陕西师范大学学报: 自然科学版,2002,30:5-11.
*   [5] 维基百科. 豪斯多夫维数[EB/OL],[2024-05-28]. https://en.wikipedia.org/wiki/Hausdorff_dimension.
*   [6] 葡萄味的玉米. 讲义2:Hausdorff测度,等直径不等式和与Lebesgue测度的关系[EB/OL]. 知乎专栏.[2023-10-20]https://zhuanlan.zhihu.com/p/670818924.
