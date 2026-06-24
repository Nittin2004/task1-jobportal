export const aptitudeTheory = [
  // ────────────────────────────────────────────────────────────
  // QUANTITATIVE APTITUDE
  // ────────────────────────────────────────────────────────────
  {
    id: 'quant-number-system',
    category: 'Quantitative',
    topic: 'Number System, LCM & HCF',
    subtopics: 'Divisibility Rules, Factors, Multiples, Prime Numbers, Remainders',
    theory: `**Definition:**
The Number System deals with classifying numbers and their properties.
- **Prime Number:** A number divisible only by $1$ and itself (e.g., $2, 3, 5, 7$).
- **HCF (Highest Common Factor):** The largest number that divides given numbers perfectly.
- **LCM (Least Common Multiple):** The smallest number which is perfectly divisible by given numbers.

**Formulas:**
- $A \\times B = \\text{HCF} \\times \\text{LCM}$
- Divisibility by $3$: Sum of digits must be divisible by $3$.
- Divisibility by $4$: Last two digits must be divisible by $4$.`,
    example: `**Question:** Two numbers have an HCF of $4$ and an LCM of $48$. If one number is $12$, what is the other number?

**Solution:**
We know that: $\\text{First Number} \\times \\text{Second Number} = \\text{HCF} \\times \\text{LCM}$
$$12 \\times x = 4 \\times 48$$
$$12x = 192$$
$$x = \\frac{192}{12} = 16$$
**Answer:** The other number is $16$.`
  },
  {
    id: 'quant-percentages-profit',
    category: 'Quantitative',
    topic: 'Percentages, Profit & Loss',
    subtopics: 'Percentage Increase/Decrease, Discount, Marked Price, Successive Percentage',
    theory: `**Definition:**
A percentage is a fraction out of $100$. Profit and loss deal with money gained or lost during buying and selling.
- **Cost Price (CP):** The price used to buy the item.
- **Selling Price (SP):** The price used to sell the item.
- **Marked Price (MP):** The price tag on the item before discount.

**Formulas:**
- **Percentage Change:** $\\frac{\\text{New Value} - \\text{Old Value}}{\\text{Old Value}} \\times 100\\%$
- **Profit:** $SP - CP$ (when $SP > CP$)
- **Loss:** $CP - SP$ (when $CP > SP$)
- **Profit %:** $\\frac{\\text{Profit}}{CP} \\times 100\\%$
- **Discount:** $MP - SP$`,
    example: `**Question:** A shopkeeper buys a book for $\\$100$ and sells it for $\\$120$. What is his profit percentage?

**Solution:**
$$CP = 100$$
$$SP = 120$$
$$\\text{Profit} = SP - CP = 120 - 100 = 20$$
$$\\text{Profit } \\% = \\left( \\frac{20}{100} \\right) \\times 100\\% = 20\\%$$
**Answer:** The profit is $20\\%$.`
  },
  {
    id: 'quant-ratio-mixtures',
    category: 'Quantitative',
    topic: 'Ratio, Proportion & Mixtures',
    subtopics: 'Partnership, Mixtures & Allegations',
    theory: `**Definition:**
A **Ratio** compares two quantities of the same type. **Mixtures** deal with combining two different qualities of an item.

**Formulas:**
- **Proportion:** If $A:B = C:D$, then $A \\times D = B \\times C$ (Product of extremes = Product of means).
- **Rule of Allegation:** To find the ratio of mixing a cheaper item and a dearer (expensive) item to get a target mean price:
$$\\frac{\\text{Quantity of Cheaper}}{\\text{Quantity of Dearer}} = \\frac{\\text{Price of Dearer} - \\text{Mean Price}}{\\text{Mean Price} - \\text{Price of Cheaper}}$$`,
    example: `**Question:** In what ratio must rice at $\\$9/kg$ be mixed with rice at $\\$15/kg$ to make a mixture worth $\\$11/kg$?

**Solution:**
Using the Rule of Allegation:
- Price of Cheaper = $9$
- Price of Dearer = $15$
- Mean Price = $11$

$$\\text{Ratio} = \\frac{15 - 11}{11 - 9} = \\frac{4}{2} = \\frac{2}{1}$$
**Answer:** The ratio is $2:1$.`
  },
  {
    id: 'quant-averages',
    category: 'Quantitative',
    topic: 'Averages',
    subtopics: 'Weighted Average, Running Average',
    theory: `**Definition:**
An average is a single central value that represents a group of numbers.

**Formulas:**
- **Simple Average:** 
$$\\text{Average} = \\frac{\\text{Sum of all items}}{\\text{Total number of items}}$$
- **Weighted Average:** (Used when groups have different sizes)
$$\\text{Weighted Avg} = \\frac{W_1X_1 + W_2X_2}{W_1 + W_2}$$
*(Where $W$ is the weight/size and $X$ is the average of that group)*`,
    example: `**Question:** The average age of $4$ boys is $10$ years. If a $15$-year-old boy joins them, what is the new average age?

**Solution:**
1. Sum of ages of $4$ boys = $4 \\times 10 = 40$ years.
2. New sum = $40 + 15 = 55$ years.
3. Total boys = $4 + 1 = 5$ boys.
4. New Average = $\\frac{55}{5} = 11$ years.
**Answer:** The new average is $11$ years.`
  },
  {
    id: 'quant-time-work',
    category: 'Quantitative',
    topic: 'Time & Work, Pipes & Cisterns',
    subtopics: 'Work Efficiency, Inlet & Outlet Pipes',
    theory: `**Definition:**
Deals with finding how long it takes people or machines to complete a task.

**Formulas:**
- If A completes work in $X$ days, **A's 1-day work** = $\\frac{1}{X}$.
- If B completes work in $Y$ days, **B's 1-day work** = $\\frac{1}{Y}$.
- **Combined 1-day work:** $\\frac{1}{X} + \\frac{1}{Y}$
- **Pipes:** An inlet pipe does $+ \\frac{1}{X}$ work. An outlet (drain) pipe does $- \\frac{1}{Y}$ work.`,
    example: `**Question:** Pipe A fills a tank in $10$ hours. Pipe B fills it in $15$ hours. How long will they take together?

**Solution:**
1. Pipe A's 1-hour work = $\\frac{1}{10}$
2. Pipe B's 1-hour work = $\\frac{1}{15}$
3. Combined 1-hour work = $\\frac{1}{10} + \\frac{1}{15}$
$$= \\frac{3}{30} + \\frac{2}{30} = \\frac{5}{30} = \\frac{1}{6}$$
Since they fill $\\frac{1}{6}$ of the tank in 1 hour, it will take them $6$ hours to fill the whole tank.
**Answer:** $6$ hours.`
  },
  {
    id: 'quant-tsd',
    category: 'Quantitative',
    topic: 'Time, Speed & Distance',
    subtopics: 'Trains, Boats & Streams, Relative Speed',
    theory: `**Definition:**
The relationship between how fast an object moves, how long it travels, and how far it goes.

**Formulas:**
- **Distance Formula:** $D = S \\times T$
- **Speed Formula:** $S = \\frac{D}{T}$
- **Unit Conversion:** $\\text{km/hr} \\times \\frac{5}{18} = \\text{m/s}$
- **Relative Speed:**
  - Opposite directions: $S_1 + S_2$
  - Same direction: $S_1 - S_2$
- **Boats:**
  - Downstream (with river): $\\text{Boat Speed} + \\text{River Speed}$
  - Upstream (against river): $\\text{Boat Speed} - \\text{River Speed}$`,
    example: `**Question:** A car travels $150 \\text{ km}$ in $3 \\text{ hours}$. What is its speed?

**Solution:**
$$S = \\frac{D}{T}$$
$$S = \\frac{150}{3} = 50 \\text{ km/hr}$$
**Answer:** The speed is $50 \\text{ km/hr}$.`
  },
  {
    id: 'quant-interest',
    category: 'Quantitative',
    topic: 'Simple & Compound Interest',
    subtopics: 'SI, CI formulas, Difference between SI & CI',
    theory: `**Definition:**
Interest is the extra money paid for borrowing money. Simple Interest (SI) is calculated only on the main principal. Compound Interest (CI) is calculated on principal plus previous interest.

**Formulas:**
- **Simple Interest (SI):** 
$$\\text{SI} = \\frac{P \\times R \\times T}{100}$$
- **Compound Interest (Amount):** 
$$A = P \\left(1 + \\frac{R}{100}\\right)^T$$
- **Compound Interest (CI):** 
$$\\text{CI} = A - P$$
*(Where $P$ = Principal money, $R$ = Rate %, $T$ = Time in years)*`,
    example: `**Question:** Find the Simple Interest on $\\$1000$ at $5\\%$ per year for $2$ years.

**Solution:**
$$P = 1000, R = 5, T = 2$$
$$\\text{SI} = \\frac{1000 \\times 5 \\times 2}{100}$$
$$\\text{SI} = \\frac{10000}{100} = 100$$
**Answer:** The Simple Interest is $\\$100$.`
  },
  {
    id: 'quant-pnc-prob',
    category: 'Quantitative',
    topic: 'Permutation, Combination & Probability',
    subtopics: 'Arrangements, Selections, Events',
    theory: `**Definition:**
- **Permutation:** Ways to arrange items (Order matters).
- **Combination:** Ways to select items (Order doesn't matter).
- **Probability:** The chance of an event happening.

**Formulas:**
- **Permutation:** $^nP_r = \\frac{n!}{(n-r)!}$
- **Combination:** $^nC_r = \\frac{n!}{r!(n-r)!}$
- **Probability:** 
$$P = \\frac{\\text{Number of Favorable Outcomes}}{\\text{Total Possible Outcomes}}$$`,
    example: `**Question:** A bag has $3$ red balls and $2$ blue balls. What is the probability of picking a blue ball?

**Solution:**
Total balls = $3 + 2 = 5$.
Favorable balls (blue) = $2$.
$$P = \\frac{2}{5}$$
**Answer:** The probability is $\\frac{2}{5}$ or $40\\%$.`
  },

  // ────────────────────────────────────────────────────────────
  // LOGICAL REASONING
  // ────────────────────────────────────────────────────────────
  {
    id: 'logical-coding',
    category: 'Logical',
    topic: 'Coding-Decoding',
    subtopics: 'Letter Coding, Number Coding',
    theory: `**Definition:**
Coding is hiding the meaning of a word using a secret rule. Decoding is finding that rule.

**Rules to look for:**
- **Shifting:** Each letter moves $+1, +2, -1$ in the alphabet.
- **Reversing:** The word is spelled backwards.
- **Numbering:** $A=1, B=2, C=3$.`,
    example: `**Question:** If CAT is coded as $3-1-20$, how is DOG coded?

**Solution:**
The rule uses the alphabet number position.
- D = $4$
- O = $15$
- G = $7$

**Answer:** DOG is $4-15-7$.`
  },
  {
    id: 'logical-blood',
    category: 'Logical',
    topic: 'Blood Relations',
    subtopics: 'Family Trees, Pointing Questions',
    theory: `**Definition:**
Tracing how people are related in a family tree.

**Best Practice:**
Always draw a quick diagram.
- Use a **Square** for Males.
- Use a **Circle** for Females.
- Use a **Horizontal Line** for siblings.
- Use a **Vertical Line** for parents to children.`,
    example: `**Question:** A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?

**Solution:**
1. A (Male) is brother of B (Female).
2. B is sister of C (Male, since he is a father).
3. Therefore, A, B, and C are siblings.
4. C is the father of D. 
5. A is the brother of D's father.

**Answer:** A is D's Uncle.`
  },
  {
    id: 'logical-directions',
    category: 'Logical',
    topic: 'Direction Sense & Seating',
    subtopics: 'Compass, Linear Seating, Circular Seating',
    theory: `**Definition:**
Finding the final position or distance using North, South, East, West.

**Rules:**
- **Right turn:** $90^\\circ$ Clockwise.
- **Left turn:** $90^\\circ$ Anti-clockwise.
- **Shortest Distance:** Use the Pythagorean theorem.
$$H^2 = P^2 + B^2$$
*(Hypotenuse squared = Perpendicular squared + Base squared)*`,
    example: `**Question:** A man walks $3 \\text{ km}$ North, then turns right and walks $4 \\text{ km}$. How far is he from the start?

**Solution:**
He forms a right-angled triangle with Base = $4$ and Perpendicular = $3$.
$$H^2 = 3^2 + 4^2$$
$$H^2 = 9 + 16 = 25$$
$$H = \\sqrt{25} = 5$$
**Answer:** He is $5 \\text{ km}$ away.`
  },

  // ────────────────────────────────────────────────────────────
  // VERBAL ABILITY
  // ────────────────────────────────────────────────────────────
  {
    id: 'verbal-rc',
    category: 'Verbal',
    topic: 'Reading Comprehension',
    subtopics: 'Main Idea, Inference, Tone of Passage',
    theory: `**Definition:**
Reading a short passage and answering questions about its main idea or hidden meanings.

**Key Concepts:**
- **Main Idea:** The primary point the author is trying to make.
- **Inference:** A conclusion you can draw that is not explicitly written.
- **Tone:** The author's attitude (e.g., Happy, Angry, Sarcastic, Objective).`,
    example: `**Passage:** "The heavy rain ruined the crops, leaving the farmers worried about the upcoming winter."

**Question:** What is the tone of the passage?
**Answer:** The tone is **pessimistic** or **concerned**, due to words like "ruined" and "worried".`
  },
  {
    id: 'verbal-grammar',
    category: 'Verbal',
    topic: 'Grammar: Error Detection',
    subtopics: 'Subject-Verb Agreement, Tenses, Prepositions',
    theory: `**Definition:**
Finding the grammatical mistake in a sentence.

**Important Rules:**
1. **Subject-Verb Agreement:** A singular subject takes a singular verb (has an 's'). A plural subject takes a plural verb.
2. **Conditional Words:** Sentences starting with "If" often use "were" instead of "was" for hypothetical situations.`,
    example: `**Question:** Find the error: "He don't like playing basketball."

**Solution:**
"He" is a singular subject. The verb "do not" is plural. It must match the singular subject with "does not".

**Answer:** "He **doesn't** like playing basketball."`
  },
  {
    id: 'verbal-parajumbles',
    category: 'Verbal',
    topic: 'Para Jumbles',
    subtopics: 'Sentence Rearrangement, Mandatory Pairs',
    theory: `**Definition:**
A set of jumbled sentences that must be arranged to form a clear paragraph.

**Rules:**
1. **Find the Starter:** Look for a sentence that introduces a noun. Avoid sentences starting with "He", "Therefore", or "But".
2. **Find Pairs:** If sentence A mentions "a new car" and sentence B says "The car was red", A must come before B.`,
    example: `**Question:** Rearrange: 
(A) He took an umbrella. 
(B) John looked outside. 
(C) It was raining heavily.

**Solution:**
1. Starter: (B) introduces the noun "John".
2. Pair: He looked outside and saw (C) it was raining. 
3. Conclusion: Because of the rain, (A) he took an umbrella.

**Answer:** The correct order is B, C, A.`
  }
];
