---

title: Ender Pearl Trajectory
description: Solution to the trajectory of flying ender pearl in minecraft.
date: 2020-09-13

---

# Ender Pearl Trajectory

## Objective

1. To investigate the trajectory of an ender pearl given its initial velocity vector.
2. To apply mathematical model to formulate the trajectory.
3. To predict the fly track accurately using math models and tools.

## Definitions

### Definition of displacement differnetials

The displacement differential vector $\Delta \vec{S_t}$ determines how far the projectile needs to be travelled in the next game tick.
$$
\begin{align}
\Delta \vec{S_t} = 

\begin{pmatrix}
\Delta x_t \\
\Delta y_t \\
\Delta z_t \\

\end{pmatrix}
\end{align}
$$
Where componenets of $\Delta \vec{S_t} $ are the following

- $\Delta x_t$ : Along the X direction
- $\Delta y_t$ : Along the Y direction
- $\Delta z_t$ : Along the Z direction

### Definition of initial velocity

The initial velocity **vector** $\vec{u}$ (often supplied by TNT explosions) are given by
$$
\begin{align}
\vec{u} = 

\begin{pmatrix}
\Delta x_0 \\
\Delta y_0 \\
\Delta z_0 \\

\end{pmatrix}
\end{align}
$$
The components of $\vec{u}$ are symbolized as below

- $u_x = \Delta x_0$ : Initial velocity along X direction
- $u_y = \Delta y_0$ : Initial velocity along Y direction
- $u_z = \Delta z_0$ : Initial velocity along Z direction

<br>

Note that symbol $\vec{u}$ (sometimes written as **u**) *is only used* to describe initial velocity at **t=0**.
Note that $\Delta \vec{S_0} = \vec{u}$

### Ender Pearl physics

The initial velocity is given by $\vec{u}$, where $\lvert\vec{u}\rvert = \sqrt{\Delta x_0^2 + \Delta y_0^2 + \Delta z_0^2}$. The notation of ΔS_0 represents a subscript, i.e. $\Delta S_0$

```mermaid
graph TB
	subgraph Accleration stage
        1[TNT gives acceleration along the XYZ direction to the ender pearl]
        2[Ender Pearl build up its initial velocity u=ΔS_0]
	end
	
	1-->2
	
	5[Next game tick has arrived t+1]
	
	subgraph Flight stage
	
        3[Ender pearl travels a distance of ΔS_t]
        4[The game calculates the distance to be travelled in the next gametick as  ΔS_t+1]
        7[Block for clarifying the arrows, please ignore me]
        6[The game has done all required jobs for ender pearl within this game tick] 

	end
	    2-->5
        5-->3
        5-->4
        3-->7
        4-->7
        7-->6
        6-->5
      
```

### Ender Pearl Displacement Differential

The displacement differential are given by the following three formulas. These are known facts.
(Source: [Xcom6000](https://youtu.be/Wc1E1zR40gw))
$$
\begin{align}
\Delta X_{t+1} &= 0.99 \Delta X_t\\
\Delta Y_{t+1} &= 0.99 \Delta Y_t - 0.03\\
\Delta Z_{t+1} &= 0.99 \Delta Z_t\\
\end{align}
$$
Where 0.99 is the **pearl drag**, -0.03 would be the **gravity**.

To skip chunk loading for all chunks in flight (Only center chunks), $\lvert\vec{\Delta S_t}\rvert > 320$ m/s, or  $16$ blocks/tick (i.e. the side length of 1 chunk).

## Derivation

### Trajectory

Trajectory is the flight curve that an ender pearl has travelled.

This would be the sum of displacement differential $\vec{S}(t)$ In other words
$$
\begin{align}
\vec{S}(t) &= \sum_{\tau=0}^t \Delta \vec{S_{\tau}} \\
S_x(t) &= \sum_{\tau=0}^t \Delta x_\tau  \\
S_y(t) &= \sum_{\tau=0}^t \Delta y_\tau  \\
S_z(t) &= \sum_{\tau=0}^t \Delta z_\tau  \\
\end{align}
$$
#### X-Z direction

Deriving on X-Z would be rather simple as it is just a matter of the powers of 0.99

##### Variables

1. $u_x$
2. $u_z$

##### Derivation

Take X direction for example, same for Z direction. In here, the $\Delta x$ means the displacement differential on X direction.
$$
\begin{align}
\Delta x_{0} &= u_x\\
\Delta x_{1} &= 0.99 u_x\\
\Delta x_{2} &= 0.99 (\Delta x_{1})\\
\Delta x_{3} &= 0.99 (\Delta x_{2})\\
\Delta x_{k} &= 0.99^k u_x
\end{align}
$$
Then its sum, i.e. the X component of the trajectory with respect to time $S_x(t)$ would be
$$
\begin{align}
S_x(t) &= \sum_{k=0}^t \Delta x_k\\
	&= u_x\sum_{k=0}^t 0.99^k\\
	&= u_x(\frac{1-0.99^t}{1-0.99}) &\quad\quad\text{Sum of GS}\\
	&= 100u_x(1-0.99^t)
\end{align}
$$
There will be a flight distance limit, if $t\to\infty$. (Assume constant height, $\Delta y_t$ = 0)
$$
\begin{align}
\lim_{t\to\infty}S_x(t) &= \lim_{t\to\infty}\sum_{k=0}^t \Delta x_k\\
	&= \lim_{t\to\infty}u_x\sum_{k=0}^t 0.99^k\\
	&= u_x \frac{1}{1-0.99}\\
	&= 100u_x
\end{align}
$$
Same goes for Z direction.

#### Y-direction

##### Variables

1. $u_y$
2. **Gravity** = -0.03

##### Derivation

###### n tick displacement differential formula

The Y direction have both **pearl drag** and **gravity**. It takes some more steps to tackle it.
$$
\begin{align}
\Delta y_{0} &= u_y\\
\Delta y_{1} &= 0.99 u_y - 0.03\\
\Delta y_{2} &= 0.99 (\Delta y_{1}) - 0.03\\
\Delta y_{3} &= 0.99 (\Delta y_{2}) - 0.03\\
\vdots
\end{align}
$$
Simplifying the expression
$$
\begin{align}
x_1 &= ax + b	&\text{Consider variables $a,b,x_t$}\\
x_2 &= ax_1 + b\\
	&= a(ax + b) + b\\
	&= a^2x+ ab + b \\
x_3	&= ax_2 + b\\
	&= a(a^2x+ ab + b) + b\\
	&= a^3x+a^2b+ab+b\\
\\
\text{Proposition $P(n): x_n$}&= a^nx+b(\frac{1-a^{n}}{1-a})\\ \\
P(1) : x_1=ax+b&=a^1x+b(\frac{1-a}{1-a}) &\text{See Mathematical induction}\\
&=ax+b\\
&\therefore\text{$P(1)$ is true.}\\\\

P(k) 			&= a^kx+b(\frac{1-a^{k}}{1-a})
&\text{Prove $P(k) \to P(k+1)$}\\
aP(k)+b 		&= a(a^kx+b(\frac{1-a^{k}}{1-a})) + b\\
				&=a^{k+1}x+b(\frac{a-a^{k+1}+1-a}{1-a})\\
				&=a^{k+1}x+b(\frac{1-a^{k+1}}{1-a})\\
				&=P(k+1)\\
&\therefore\text{$P(k) \to P(k+1)$ is true.}\\\\

&\therefore\text{$x_n \equiv a^nx+b(\frac{1-a^{n}}{1-a})$}\\
\end{align}
$$
Subsititude $a=0.99,b=-0.03$.
$$
\begin{align}
\Delta y_{t} &= 0.99^tu_y-0.03(\frac{1-0.99^t}{1-0.99})\\
\Delta y_{t} &= 0.99^tu_y-3(1-0.99^t)\\
\Delta y_{t} &= 0.99^t(u_y+3)-3
\end{align}
$$

###### Trajectory formula on Y axis

$$
\begin{align}
S_y(t) &= 	\sum_{\tau=0}^t \Delta y_{\tau} \\
	&=	\sum_{\tau=0}^t 0.99^\tau(u_y+3)-3\\
	&=	(u_y+3)(\frac{1-0.99^t}{1-0.99})-3t\\
	&=	100(u_y+3)(1-0.99^t)-3t\\
\end{align}
$$

## Plotting the trajectory curve

We have obtained these trajectory formulas for individual components. $L_{xz}(t)$ is the total distance travelled on the X-Z plane.
$$
\begin{align}
S_x(t) = x(t)	&=	100u_x(1-0.99^t)\\
S_y(t) = y(t)	&=	100(u_y+3)(1-0.99^t)-3t\\
S_z(t) = z(t)	&=	100u_z(1-0.99^t)\\
L_{xz}(t)		&=	\sqrt{S_x^2(t) + S_z^2(t)}\\
				&=	\sqrt{x^2(t) + z^2(t)}\\
				&=	100(1-0.99^t)\sqrt{u_x^2 + u_z^2}
\end{align}
$$

### X-Y plane

We want to plot $y(x)$. To plot this, we first find inverse of $x(t)$ to resolve $t=x^{-1}(x)$.
$$
\begin{align}
x(t) &= 100u_x(1-0.99^t)\\
\frac{x(t)}{100u_x} &= 1-0.99^t\\
0.99^t &= 1-\frac{x(t)}{100u_x}\\
t(x) &= \log_{0.99}{(1-\frac{x}{100u_x})} &\text{Inverse of $x(t)$}\\
\end{align}
$$
Now to plot it we can simply subsititude $t=t(x)$ to get $y(t)$
$$
\begin{align}
y(t)	&=	100(u_y+3)(1-0.99^t)-3t\\
y(t(x)) 	&=	100(u_y+3)(1-0.99^{t(x)})-3t(x)
\end{align}
$$
To link up all, where $t(x) = \log_{0.99}{(1-\frac{x}{100u_x})}$
$$
\begin{align}
y(t(x)) 	&=	100(u_y+3)(1-0.99^{t(x)})-3t(x)\\
y(x) 	&=	100(u_y+3)(1-0.99^{\frac{\log(1-\frac{x}{100u_x})}{\log(99)-2}})-3\frac{\log(1-\frac{x}{100u_x})}{\log(99)-2}\\
\end{align}
$$

### $L_{xz}$-Y plane

The method of deriving is very similar to the way we derived X-Y plane. The only difference would be considering $L_{xz}(t)$ instead of $x(t)$.
$$
\begin{align}
L_{xz}(t)	&=	100(1-0.99^t)\sqrt{u_x^2 + u_z^2}			\\
\frac{L_{xz}(t)}{100\sqrt{u_x^2 + u_z^2}}	&=	1-0.99^t		\\
0.99^t		&=	1-\frac{L_{xz}(t)}{100\sqrt{u_x^2 + u_z^2}}	\\
t(L_{xz}) 	&= \log_{0.99}{(1-\frac{L_{xz}}{100\sqrt{u_x^2 + u_z^2}})} &\text{Inverse of $L_{xz}(t)$}\\
\end{align}
$$
Subsititude it to $y(t)$ where $t= t(L_{xz})$.
$$
\begin{align}
y(t)	&=	100(u_y+3)(1-0.99^t)-3t\\
y(t(L_{xz})) 	&=	100(u_y+3)(1-0.99^{t(L_{xz})})-3t(L_{xz})
\end{align}
$$
One step further, but often unnecessary,
$$
\begin{align}
y(t(L_{xz})) 	&=	100(u_y+3)(1-0.99^{t(L_{xz})})-3t(L_{xz})	\\
y(L_{xz}) 	&=	100(u_y+3)(1-0.99^{\log_{0.99}{(1-\frac{L_{xz}}{100\sqrt{u_x^2 + u_z^2}})}})-3\log_{0.99}{(1-\frac{L_{xz}}{100\sqrt{u_x^2 + u_z^2}})}\\
&=	100(u_y+3)(\frac{L_{xz}}{100\sqrt{u_x^2 + u_z^2}})-3\log_{0.99}{(1-\frac{L_{xz}}{100\sqrt{u_x^2 + u_z^2}})}\\
\end{align}
$$

#### Result (Desmos)

:::desmos{key="45bb9b3b9b8c45da9f842ae626539ffd" lang="en"}
```json
{"version":11,"randomSeed":"d39a62d604f46cf8d1b9469f1951e997","graph":{"viewport":{"xmin":-753.8328019055733,"ymin":-948.4011015838091,"xmax":962.1199436683343,"ymax":671.4582902379595},"__v12ViewportLatexStash":{"xmin":"-753.8328019055733","xmax":"962.1199436683343","ymin":"-948.4011015838091","ymax":"671.4582902379595"}},"expressions":{"list":[{"type":"folder","id":"34","title":"Initial velocity","collapsed":true},{"type":"expression","id":"31","folderId":"34","color":"#388c46","latex":"u_{x}=5"},{"type":"expression","id":"14","folderId":"34","color":"#2d70b3","latex":"u_{y}=5","slider":{"hardMin":true,"hardMax":true,"min":"0","max":"5"}},{"type":"expression","id":"15","folderId":"34","color":"#388c46","latex":"u_{z}=0"},{"type":"folder","id":"42","title":"Parameters","collapsed":true},{"type":"text","id":"45","folderId":"42","text":"Pearl drag constant"},{"type":"expression","id":"43","folderId":"42","color":"#2d70b3","latex":"\\alpha=0.99","slider":{"hardMin":true,"hardMax":true,"min":"0","max":"1"}},{"type":"text","id":"46","folderId":"42","text":"Gravity"},{"type":"expression","id":"44","folderId":"42","color":"#388c46","latex":"g=0.03"},{"type":"folder","id":"36","title":"Experimental result (Ux = 5, Uy = 5)","collapsed":true},{"id":"27","type":"table","folderId":"36","columns":[{"values":["0","5","9.95","14.851","19.702","24.505","29.26","33.967","38.628","43.241","47.809","52.331","56.808","61.239","65.627","69.971","74.271","78.528","82.743","86.916","91.047","95.136","99.185","103.19","107.16","111.09","114.98","118.83","122.64","126.41","130.15","133.85","137.51","141.13","144.72","148.28","151.79","155.28","158.72","162.14","165.51","168.86","172.17","175.45","178.69","181.91","185.09","188.24","191.35","194.44","197.5","200.52","203.52","206.48","209.42","212.32","215.2","218.05","220.87","223.66","226.42","229.16","231.87","234.55","237.2","239.83","242.43","245.01","247.56","250.08","252.58","255.05","257.5","259.93","262.33","264.71","267.06","269.39","271.7","273.98","276.24","278.48","280.69","282.88","285.06","287.2","289.33","291.44","293.53","295.59","297.63","299.66","301.66","303.64","305.61","307.55","309.48","311.38","313.27","315.14","316.98","318.81","320.63","322.42","324.2","325.95","327.69","329.42","331.12","332.81","334.48","336.14","337.78","339.4","341.01","342.6","344.17","345.73","347.27","348.8","350.31","351.81","353.29","354.76","356.21","357.65","359.07","360.48","361.87","363.26","364.62","365.98","367.32","368.64","369.96","371.26","372.55","373.82","375.08","376.33","377.57","378.79","380","381.2","382.39","383.57","384.73","385.88","387.03","388.16","389.27","390.38","391.48","392.56","393.64","394.7","395.75","396.8","397.83","398.85","399.86","400.86","401.85","402.84","403.81","404.77","405.72","406.66","407.6","408.52","409.44","410.34","411.24","412.13","413.01","413.88","414.74","415.59","416.43","417.27","418.1","418.92","419.73","420.53","421.32","422.11","422.89","423.66","424.42","425.18","425.93","426.67","427.4","428.13","428.85","429.56","430.26","430.96","431.65","432.33","433.01","433.68","434.34","435","435.65","436.29","436.93","437.56","438.19","438.8","439.42","440.02","440.62","441.22","441.8","442.38","442.96","443.53","444.1","444.66","445.21","445.76","446.3","446.84","447.37","447.89","448.41","448.93","449.44","449.95","450.45","450.94","451.43","451.92","452.4","452.88","453.35","453.81","454.28","454.73","455.19","455.63","456.08","456.52","456.95"],"hidden":true,"id":"25","color":"#2d70b3","latex":"x_{1}"},{"values":["0","5","9.92","14.761","19.523","24.208","28.816","33.348","37.804","42.186","46.494","50.729","54.892","58.983","63.003","66.953","70.834","74.645","78.389","82.065","85.674","89.218","92.696","96.109","99.457","102.74","105.97","109.13","112.22","115.26","118.24","121.16","124.02","126.82","129.56","132.24","134.87","137.44","139.96","142.42","144.82","147.17","149.47","151.72","153.91","156.05","158.14","160.18","162.17","164.11","166","167.84","169.63","171.37","173.07","174.72","176.32","177.88","179.39","180.85","182.27","183.65","184.99","186.28","187.52","188.73","189.89","191.01","192.09","193.13","194.13","195.09","196.01","196.89","197.73","198.53","199.3","200.02","200.71","201.37","201.98","202.56","203.11","203.61","204.09","204.53","204.93","205.3","205.64","205.94","206.21","206.45","206.66","206.83","206.97","207.08","207.16","207.21","207.23","207.22","207.17","207.1","207","206.87","206.71","206.53","206.31","206.07","205.8","205.5","205.17","204.82","204.44","204.04","203.61","203.15","202.67","202.16","201.63","201.08","200.5","199.89","199.26","198.61","197.93","197.23","196.51","195.77","195","194.21","193.4","192.56","191.71","190.83","189.93","189.01","188.07","187.11","186.13","185.13","184.11","183.07","182.01","180.93","179.83","178.71","177.57","176.42","175.24","174.05","172.84","171.61","170.36","169.1","167.82","166.52","165.21","163.87","162.53","161.16","159.78","158.38","156.97","155.54","154.09","152.63","151.15","149.66","148.16","146.63","145.1","143.55","141.98","140.4","138.81","137.2","135.58","133.94","132.29","130.63","128.95","127.26","125.56","123.85","122.12","120.38","118.62","116.86","115.08","113.29","111.48","109.67","107.84","106","104.15","102.29","100.42","98.535","96.64","94.734","92.816","90.888","88.949","87","85.04","83.069","81.089","79.098","77.097","75.086","73.065","71.034","68.994","66.944","64.885","62.816","60.738","58.65","56.554","54.448","52.334","50.21","48.078","45.937","43.788","41.63","39.464","37.289","35.106","32.915","30.716","28.509","26.294","24.071","21.84","19.602","17.356","15.102","12.841","10.573","8.2971","6.0141","3.724","1.4268","-0.87751"],"hidden":true,"id":"26","color":"#fa7e19","latex":"y_{1}"}]},{"type":"folder","id":"35","title":"Helper functions"},{"type":"expression","id":"16","folderId":"35","color":"#6042a6","latex":"t\\left(x\\right)=\\frac{\\left(\\log\\left(u_{x}-x\\left(1-\\alpha\\right)\\right)-\\log\\left(u_{x}\\right)\\right)}{\\log\\left(\\alpha\\right)}","hidden":true},{"type":"text","id":"37","text":"Trajectory"},{"type":"expression","id":"17","color":"#000000","latex":"y\\left(x\\right)=u_{y}\\left(\\frac{1-\\alpha^{t\\left(x\\right)}}{1-\\alpha}\\right)-\\frac{gt\\left(x\\right)}{1-\\alpha}+\\frac{g\\left(1-\\alpha^{t\\left(x\\right)}\\right)}{\\left(1-\\alpha\\right)^{2}}"},{"type":"text","id":"38","text":"Initial pitch angle"},{"type":"expression","id":"20","color":"#388c46","latex":"x\\left(\\frac{u_{y}}{\\sqrt{u_{x}^{2}+u_{z}^{2}}}\\right)","hidden":true},{"type":"expression","id":"39","color":"#2d70b3"},{"type":"expression","id":"40","color":"#388c46"}]},"includeFunctionParametersInRandomSeed":true,"doNotMigrateMovablePointStyle":true}
```
:::



## Generalized projectile trajectory

Consider the following
$$
\begin{align}
\Delta x_1 &= \alpha u_x\\
\Delta y_1 &= \alpha u_y + g\\
\Delta z_1 &= \alpha u_z
\end{align}
$$
In the previous section, we have derived the particular solution for $\alpha=0.99, g=-0.03$. In this section, we will make our attempt to obtain a general solution.

### Displacement differentials

The displacement differentials are very similar as before. $t$ represents the number of game ticks eplased.
$$
\begin{align}
\Delta x_t &= \alpha^t u_x\\
\Delta y_t &= \alpha^t u_y + g \frac{1-\alpha^t}{1-\alpha}\\
\Delta z_t &= \alpha^t u_z
\end{align}
$$

### Components of trajectory

Similar as before, the trajectory is the sum of displacement differentials from 0 to $t$.

#### X/Z/$L_{xz}$ direction

Following the same notation as above, $S_x(t)=x(t), S_z(t)=z(t), L_{xz}(t)=\sqrt{x^2(t)+z^2(t)}$
$$
\begin{align}
x(t) 		&= \sum_{\tau=0}^t \alpha^\tau u_x\\
			&= u_x\sum_{\tau=0}^t\alpha^\tau\\
			&= u_x \frac{1-\alpha^t}{1-\alpha}\\
			\\
z(t) 		&= \sum_{\tau=0}^t \alpha^\tau u_z\\
			&= u_z\sum_{\tau=0}^t \alpha^\tau \\
			&= u_z \frac{1-\alpha^t}{1-\alpha}\\
			\\
L_{xz}(t) 	&= \sqrt{x^2(t)+z^2(t)}\\
			&= \sqrt{(u_x \frac{1-\alpha^t}{1-\alpha})^2+(u_z \frac{1-\alpha^t}{1-\alpha})^2}\\
			&= \frac{1-\alpha^t}{1-\alpha}\sqrt{u_x^2+u_z^2}
\end{align}
$$

#### Y direction

Deriving Y-direction takes a little bit of hard work and extra attention. ~~I must not say I was way too careless~~
$$
\begin{align}
 S_y(t)&=y(t) \\
y(t)	&=	\sum_{\tau=0}^t (\alpha^\tau u_y+g(\frac{1-\alpha^\tau}{1-\alpha}))\\
		&=	u_y\sum_{\tau=0}^t \alpha^\tau + \frac{g}{1-\alpha}\sum_{\tau=0}^t(1-\alpha^\tau)\\
		&=	u_y\frac{1-\alpha^t}{1-\alpha} + \frac{g}{1-\alpha}\sum_{\tau=0}^t 1 -\frac{g}{1-\alpha}\sum_{\tau=0}^t \alpha^\tau\\
		&=	u_y\frac{1-\alpha^t}{1-\alpha} + \frac{gt}{1-\alpha} -\frac{g}{1-\alpha}\frac{1-\alpha^t}{1-a}\\
		&=	u_y\frac{1-\alpha^t}{1-\alpha} + \frac{gt}{1-\alpha} -g\frac{(1-\alpha^t)}{(1-\alpha)^2}\\
		&= (u_y-\frac{g}{1-\alpha})(\frac{1-\alpha^t}{1-\alpha}) + \frac{gt}{1-\alpha}
\end{align}
$$

#### Plotting generalized trajectory on $L_{xz}$-Y plane

##### Derive inverse of $L_{xz}(t) = \sqrt{S_x^2(t)+S_z^2(t)}$

$$
\begin{align}
L_{xz}(t) &= \frac{1-\alpha^t}{1-\alpha}\sqrt{u_x^2+u_z^2}\\
L_{xz}(t)\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}} &=1-\alpha^t\\
\alpha^t &=1-L_{xz}(t)\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}\\
t(L_{xz}) &= \log_\alpha({1-L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}}) &\text{Inverse of $L_{xz}(t)$}
\end{align}
$$

##### Substitute $t=t(L_{xz})$

$$
\begin{align}
y(t)			&= 	(u_y-\frac{g}{1-\alpha})(\frac{1-\alpha^t}{1-\alpha}) + \frac{gt}{1-\alpha}\\
y(t(L_{xz}))	&= 	(u_y-\frac{g}{1-\alpha})(\frac{1-\alpha^{t(L_{xz})}}{1-\alpha}) + \frac{gt(L_{xz})}{1-\alpha}
\end{align}
$$

##### One last step...

$$
\begin{align}
y(t(L_{xz}))	
&= 	(u_y-\frac{g}{1-\alpha})(\frac{1-\alpha^{t(L_{xz})}}{1-\alpha}) + \frac{gt(L_{xz})}{1-\alpha}\\
&= 	(u_y-\frac{g}{1-\alpha})(\frac{1-\alpha^{\log_\alpha({1-L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}}))}}{1-\alpha}) + \frac{g\log_\alpha({1-L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}})}{1-\alpha}\\
&= 	(u_y-\frac{g}{1-\alpha})(\frac{L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}}{1-\alpha}) + \frac{g\log_\alpha({1-L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}})}{1-\alpha}\\
&= 	(u_y-\frac{g}{1-\alpha})(\frac{L_{xz}}{\sqrt{u_x^2+u_z^2}}) + \frac{g}{1-\alpha}\log_\alpha({1-L_{xz}\frac{1-\alpha}{\sqrt{u_x^2+u_z^2}}})\\
\\
&=\left(u_{y}-\frac{g}{1-\alpha}\right)\left(\frac{L_{xz}}{\sqrt{u_{x}^{2}+u_{z}^{2}}}\right)+\frac{g}{1-\alpha}\log_{\alpha}\left(1-\frac{L_{xz}\left(1-\alpha\right)}{\sqrt{u_{x}^{2}+u_{z}^{2}}}\right)
\end{align}
$$

## Author 

- computerbigboom@HKRAE

- HyperXraft@HKRAE

[Join HKRAE!](https://discord.gg/9sSRkZH)

2020-09-13

---

[Back to home](/)



