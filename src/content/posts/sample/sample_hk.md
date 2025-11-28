---

title: "範例網誌文章"
description: "所有功能示範。"

---

# 網誌例子

呢篇係一個簡單示範。

## 1. 熒光筆

你可以用 ==熒光筆== 嚟標示重點，用兩個等號包住就得。

再舉個例：呢句係 ==超級重要== 嘅資訊。

### 1.1.1 字型變化

- **粗體**
- *斜體*
- ***粗斜體***
- `等寬字體`
- ~~刪除線~~
- x_下標_
- x^上標^
- 打字機機掣 <kbd>Ctrl</kbd> + <kbd>C</kbd>

### 1.1.2 代碼段

#### C

```c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;
}
```

#### Python

```python
def hello_world():
    print("Hello, World!")
```

#### Rust

```rust
fn main() {
    println!("Hello, World!");
}
```

## 2. 打字機機掣

要複製就撳 <kbd>Ctrl</kbd> + <kbd>C</kbd>。

Mac 用戶貼上就撳 <kbd>⌘</kbd> + <kbd>V</kbd>。

## 3. 上標同下標

水嘅化學式係 H_2_O。

愛因斯坦嘅著名方程：E = mc^2^

其他例子：x^2^ + y^2^ = z^2^ 同埋 CO_2_ 排放。

## 4. 數學公式（LaTeX）

### Desmos 圖

:::desmos{lang="en" link="https://www.desmos.com/calculator/0fd37b7cad"}
:::

### 行內數學

二次方程根嘅公式係 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。

圓形面積係 $A = \pi r^2$。

### 獨立數學區塊

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

$$
a_0 = \frac{1}{L} \int_{-L}^{L} f(x) \, dx
$$

$$
a_n = \frac{1}{L} \int_{-L}^{L} f(x) \cos\left(\frac{n\pi x}{L}\right) dx, \quad n = 1, 2, 3, \ldots
$$

$$
b_n = \frac{1}{L} \int_{-L}^{L} f(x) \sin\left(\frac{n\pi x}{L}\right) dx, \quad n = 1, 2, 3, \ldots
$$

$$
\iiint_R f(x, y, z) \, dx \, dy \, dz = \iiint_S f(x(u,v,w), y(u,v,w), z(u,v,w)) \left| J \right| \, du \, dv \, dw
$$

$$
J = \frac{\partial(x, y, z)}{\partial(u, v, w)} = \begin{vmatrix}
\frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} & \frac{\partial x}{\partial w} \\
\frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} & \frac{\partial y}{\partial w} \\
\frac{\partial z}{\partial u} & \frac{\partial z}{\partial v} & \frac{\partial z}{\partial w}
\end{vmatrix}
$$

$$
\vec{a} \times \vec{b} = \begin{vmatrix}
\vec{i} & \vec{j} & \vec{k} \\
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3
\end{vmatrix}
$$


## 5. Mermaid 圖

### 流程圖

```mermaid
graph TD
    A[開始] --> B{有冇問題？}
    B -->|冇問題| C[好掂！]
    B -->|有問題| D[除錯]
    D --> B
    C --> E[完]
```

### 連次序圖

```mermaid
sequenceDiagram
    participant User as 用戶
    participant Browser as 瀏覽器
    participant Server as 伺服器
    User->>Browser: 提交 URL
    Browser->>Server: HTTP 請求
    Server->>Browser: HTML 回應
    Browser->>User: 畫圖
```

### UML 類別圖

```mermaid
classDiagram
    class 動物 {
        +String 名稱
        +int 歲數
        +叫()
    }
    class 狗 {
        +String 種類
        +吠()
    }
    class 貓 {
        +String 顏色
        +喵()
    }
    動物 <|-- 狗
    動物 <|-- 貓
```

## 結論

全部功能都用得！你而家可以：

- ==用螢光筆== 嚟強調最重要嘅資訊
- 顯示打字機機掣，例如 <kbd>Ctrl</kbd> + <kbd>C</kbd>
- 喺文章同上標（x^2^）同下標（H_2_O）
- 打行內數學 $\alpha + \beta = \gamma$ 同獨立顯示嘅數學公式
- 整靚靚靚嘅 Mermaid 圖表

---

[返去主頁](/)
