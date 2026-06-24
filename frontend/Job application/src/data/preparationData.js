export const preparationData = {
  aptitude: {
    title: "Aptitude Theory",
    description: "Master quantitative, logical, and verbal reasoning concepts with comprehensive theory and examples.",
    icon: "🔢",
    isTheory: true,
    questions: []
  },
  dsa: {
    title: "Data Structures & Algorithms",
    description: "Understand time complexity, design patterns, sorting, trees, and linked list structures.",
    icon: "🌳",
    questions: [
      {
        id: "dsa-1",
        title: "Array vs Linked List Comparison",
        difficulty: "Easy",
        tag: "Basics",
        question: "What is the difference between an Array and a Linked List? When would you use one over the other?",
        explanation: `### Main Differences:

| Feature | Array | Linked List |
| :--- | :--- | :--- |
| **Memory Allocation** | Contiguous memory allocation. Size is fixed at compile-time (or resized dynamically via copying). | Non-contiguous memory allocation. Nodes are linked using pointers. Dynamic sizing. |
| **Access Time** | $O(1)$ random access using index. | $O(N)$ sequential access (must traverse from head). |
| **Insertion/Deletion** | $O(N)$ on average (elements must be shifted). | $O(1)$ if the node pointer is given (no shifting needed). |
| **Memory Overhead** | Minimal. Only data is stored. | High. Each node stores data and pointer(s) to other nodes. |

### When to Use:
- **Use an Array when:**
  - You need fast, direct access to elements ($O(1)$ index lookup).
  - You know the size of the collection in advance.
  - Memory overhead needs to be kept to a minimum.
- **Use a Linked List when:**
  - You need constant time insertions and deletions at arbitrary positions.
  - The size of the dataset fluctuates dynamically.
  - Contiguous blocks of memory are unavailable.`
      },
      {
        id: "dsa-2",
        title: "Merge Sort Algorithm Details",
        difficulty: "Medium",
        tag: "Sorting",
        question: "How does the Merge Sort algorithm work, and what is its time and space complexity?",
        explanation: `### How It Works:
Merge Sort is a **Divide and Conquer** algorithm. It works by:
1. **Divide:** Dividing the unsorted list into $N$ sublists, each containing 1 element (a list of 1 element is considered sorted).
2. **Conquer:** Recursively sorting and merging sublists to produce new sorted sublists.
3. **Combine:** Repeating the merge process until there is only 1 sorted list remaining.

### Complexity Analysis:

- **Time Complexity:** 
  - **Best Case:** $O(N \\log N)$
  - **Average Case:** $O(N \\log N)$
  - **Worst Case:** $O(N \\log N)$
  - *Reasoning:* The array is split in half at each step (which takes $O(\\log N)$ levels) and merging $N$ items takes $O(N)$ time per level.
  
- **Space Complexity:** $O(N)$
  - *Reasoning:* Merge sort requires auxiliary arrays to hold elements during the merging process.

### Code Implementation (Javascript):
\`\`\`javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
\`\`\``
      },
      {
        id: "dsa-3",
        title: "Binary Search Tree (BST) Operations",
        difficulty: "Easy",
        tag: "Trees",
        question: "What is a Binary Search Tree (BST) and what are the time complexities of search, insert, and delete operations?",
        explanation: `### Definition:
A **Binary Search Tree** is a node-based binary tree data structure which has the following properties:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree of a node contains only nodes with keys **greater than** the node's key.
- Both the left and right subtrees must also be binary search trees.

### Complexities:

| Operation | Average Case | Worst Case (Skewed Tree) |
| :--- | :--- | :--- |
| **Search** | $O(\\log N)$ | $O(N)$ |
| **Insertion** | $O(\\log N)$ | $O(N)$ |
| **Deletion** | $O(\\log N)$ | $O(N)$ |

*Note: To prevent the worst-case scenario $O(N)$ where the tree becomes a linked list (skewed), self-balancing binary search trees like AVL Trees or Red-Black Trees are used to maintain $O(\\log N)$ height.*`
      },
      {
        id: "dsa-4",
        title: "DFS vs BFS Graph Traversals",
        difficulty: "Medium",
        tag: "Graphs",
        question: "Explain the difference between Depth First Search (DFS) and Breadth First Search (BFS) graph traversals.",
        explanation: `### Comparison:

| Feature | DFS (Depth First Search) | BFS (Breadth First Search) |
| :--- | :--- | :--- |
| **Traversal Style** | Goes deep along each branch before backtracking. | Explores neighbors level-by-level before moving deeper. |
| **Data Structure** | Uses a **Stack** (or recursion). | Uses a **Queue**. |
| **Memory Complexity** | $O(H)$ where $H$ is the max depth of the tree (for sparse graphs). | $O(W)$ where $W$ is the maximum width of the level. |
| **Applications** | Solving puzzles (like mazes), cycle detection, topological sorting. | Finding the shortest path in unweighted graphs, peer-to-peer networks. |

### Visualization:
For a tree with root $1$ and children $2, 3$ (where $2$ has child $4$ and $3$ has child $5$):
- **DFS Order:** $1 \\rightarrow 2 \\rightarrow 4 \\rightarrow 3 \\rightarrow 5$
- **BFS Order:** $1 \\rightarrow 2 \\rightarrow 3 \\rightarrow 4 \\rightarrow 5$`
      },
      {
        id: "dsa-5",
        title: "DP vs Divide & Conquer",
        difficulty: "Hard",
        tag: "Dynamic Programming",
        question: "What is Dynamic Programming? How does it differ from the Divide and Conquer approach?",
        explanation: `### Core Difference:
Both approaches divide a problem into smaller subproblems. The crucial difference lies in the **nature of the subproblems**:

- **Divide and Conquer** splits the problem into **independent subproblems**. The same subproblems are NOT solved repeatedly.
  - *Example:* Merge Sort, Quick Sort.
- **Dynamic Programming (DP)** is used when subproblems are **overlapping** (the same subproblem is solved multiple times) and exhibit **optimal substructure** (the optimal solution to the main problem contains optimal solutions to its subproblems).
  - *Example:* Fibonacci numbers, Knapsack Problem, Longest Common Subsequence.

### DP Techniques:
1. **Memoization (Top-down):** Start from the main problem, recursively break it down, and cache computed results in a table.
2. **Tabulation (Bottom-up):** Solve smaller subproblems first, fill up a table (iteratively), and build the solution to the main problem from there.`
      },
      {
        id: "dsa-6",
        title: "Linked List Cycle Detection",
        difficulty: "Medium",
        tag: "Linked Lists",
        question: "How do you detect if a Linked List has a cycle in it? Write the algorithm.",
        explanation: `### Floyd's Cycle-Finding Algorithm (Tortoise and Hare):
The most efficient way to detect a cycle is by using two pointers moving at different speeds:
- A **slow pointer** (tortoise) moving 1 step at a time.
- A **fast pointer** (hare) moving 2 steps at a time.

If there is a cycle, the fast pointer will eventually meet the slow pointer. If there is no cycle, the fast pointer will reach the end (\`null\`).

### Complexity:
- **Time Complexity:** $O(N)$
- **Space Complexity:** $O(1)$ auxiliary space.

### Implementation:
\`\`\`javascript
function hasCycle(head) {
  if (!head || !head.next) return false;
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      return true; // Cycle detected
    }
  }
  
  return false; // Reached end, no cycle
}
\`\`\``
      }
    ]
  },
  oops: {
    title: "OOPs Concepts",
    description: "Learn Object Oriented Programming fundamentals: encapsulation, inheritance, polymorphism, and abstraction.",
    icon: "🧱",
    questions: [
      {
        id: "oops-1",
        title: "Four Pillars of OOPs",
        difficulty: "Easy",
        tag: "Fundamentals",
        question: "What are the four main pillars of OOPs? Explain each briefly.",
        explanation: `### The Four Pillars:

1. **Encapsulation:**
   - Bundling variables and methods that operate on the data into a single unit (Class).
   - Data hiding is achieved by making instance variables \`private\` and exposing them via public getters/setters.
   - *Example:* A \`BankAccount\` class hiding the \`balance\` field.

2. **Abstraction:**
   - Hiding complex implementation details and showing only the essential features of an object.
   - Achieved using abstract classes and interfaces.
   - *Example:* Driving a car without knowing how the internal combustion engine works.

3. **Inheritance:**
   - The mechanism where one class (child/subclass) acquires properties and behaviors of another class (parent/superclass).
   - Promotes code reusability.
   - *Example:* A \`Dog\` class inheriting from a base \`Animal\` class.

4. **Polymorphism:**
   - The ability of an object or method to take on multiple forms.
   - Categorized into Compile-time (Method Overloading) and Runtime (Method Overriding).
   - *Example:* A method \`draw()\` behaves differently in a \`Circle\` class vs a \`Square\` class.`
      },
      {
        id: "oops-2",
        title: "Overloading vs Overriding",
        difficulty: "Easy",
        tag: "Polymorphism",
        question: "What is the difference between Method Overloading and Method Overriding?",
        explanation: `### Key Differences:

| Feature | Method Overloading (Compile-time) | Method Overriding (Runtime) |
| :--- | :--- | :--- |
| **Concept** | Multiple methods in the same class have the same name but different signatures (parameters). | A subclass provides a specific implementation of a method already defined in its superclass. |
| **Parameters** | Must be different (count, type, or order). | Must be exactly the same. |
| **Inheritance** | Occurs within a single class (usually). | Requires inheritance (parent and child class relationship). |
| **Binding** | Resolved at compile time (Static Binding). | Resolved at runtime (Dynamic Binding). |

### Code Example (Java-like syntax):
\`\`\`java
// Overloading
class MathOperations {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; } // Overloaded
}

// Overriding
class Animal {
    void makeSound() { System.out.println("Animal sound"); }
}
class Dog extends Animal {
    @Override
    void makeSound() { System.out.println("Bark"); } // Overridden
}
\`\`\``
      },
      {
        id: "oops-3",
        title: "Abstract Class vs Interface",
        difficulty: "Medium",
        tag: "Abstraction",
        question: "What is an abstract class and how does it differ from an interface?",
        explanation: `### Key Differences:

| Feature | Abstract Class | Interface |
| :--- | :--- | :--- |
| **Inheritance** | A class can extend only one abstract class (Single Inheritance). | A class can implement multiple interfaces (Multiple Inheritance). |
| **State/Variables** | Can contain instance variables (fields) with any access modifier. | Can only contain constants (\`public static final\`). |
| **Methods** | Can have both abstract (without body) and concrete (with body) methods. | Traditionally only abstract methods (though modern versions like Java 8+ allow \`default\` and \`static\` methods). |
| **Speed** | Marginally faster since it avoids lookup overhead. | Marginally slower due to search lookup in interface tables. |
| **Use Case** | Use when classes share a strong identity relationship (is-a) and shared code. | Use when classes share a capability or behavior (can-do) but have unrelated identities. |`
      },
      {
        id: "oops-4",
        title: "Multiple Inheritance Conflict",
        difficulty: "Medium",
        tag: "Inheritance",
        question: "Why does Java not support Multiple Inheritance with classes, and how does it resolve it?",
        explanation: `### The Diamond Problem:
If Class A has a method \`display()\`, and both Class B and Class C inherit from Class A and override \`display()\`. If Class D attempts to inherit from both B and C, which \`display()\` method should D inherit?
This ambiguity is known as the **Diamond Problem**.

To prevent compilation issues and runtime conflicts, Java does not allow extending multiple classes:
\`\`\`java
class D extends B, C { } // Compilation Error!
\`\`\`

### Resolution:
Java supports multiple inheritance of **behaviors** through **Interfaces**:
- Since interfaces contain method declarations (without implementation state), there is no diamond state conflict.
- If two interfaces declare a method with the same signature, the implementing class overrides it exactly once, resolving ambiguity.`
      },
      {
        id: "oops-5",
        title: "'this' vs 'super' Keywords",
        difficulty: "Easy",
        tag: "Basics",
        question: "Explain the roles of 'this' and 'super' keywords in object-oriented programming.",
        explanation: `### 'this' Keyword:
- Refers to the **current instance** of the class.
- Commonly used to:
  1. Differentiate local constructor parameters from class fields.
  2. Pass the current object reference as an argument.
  3. Invoke constructors from other constructors within the same class (Constructor Chaining).

### 'super' Keyword:
- Refers to the immediate **parent class instance**.
- Commonly used to:
  1. Access parent class variables or overridden methods that have been shadowed/overridden.
  2. Invoke parent class constructors (must be the first line of the child constructor).

### Code Example:
\`\`\`java
class Parent {
    Parent() { System.out.println("Parent Constructor"); }
}
class Child extends Parent {
    String name;
    Child(String name) {
        super(); // Calls Parent constructor
        this.name = name; // Differentiates parameter from field
    }
}
\`\`\``
      },
      {
        id: "oops-6",
        title: "Garbage Collection & Finalizers",
        difficulty: "Medium",
        tag: "Memory",
        question: "What is Garbage Collection? What is the purpose of the 'finalize' method?",
        explanation: `### Garbage Collection (GC):
Garbage Collection is an automatic memory management process in runtimes (like JVM, V8) that identifies and reclaims memory occupied by objects that are no longer reachable in the application code.
- Objects become eligible for GC when their references are nullified, go out of scope, or become isolated in an unreachable island of references.

### Finalize Method:
- In languages like Java, \`finalize()\` is a method belonging to the base Object class.
- The runtime calls it right before GC reclaims the object.
- **Purpose:** Close open files, database connections, and release system resources.
- *Caution:* \`finalize()\` is deprecated in modern runtimes because its execution timing is not guaranteed, and it can cause performance bottlenecks. Try-with-resources or explicit \`close()\` calls are preferred.`
      }
    ]
  },
  dbms: {
    title: "DBMS Fundamentals",
    description: "Deep dive into ACID transaction properties, database normalization levels, indexes, and keys.",
    icon: "🗄️",
    questions: [
      {
        id: "dbms-1",
        title: "ACID Transaction Properties",
        difficulty: "Easy",
        tag: "Transactions",
        question: "What are ACID properties in a Database Management System?",
        explanation: `### ACID Properties:
ACID is a set of properties that guarantee database transactions are processed reliably:

1. **Atomicity (All or Nothing):**
   - Ensures that all operations within a transaction are completed successfully; if any operation fails, the entire transaction is aborted and rolled back to its previous state.

2. **Consistency (Rules Maintained):**
   - Ensures the database moves from one valid state to another, preserving all schemas, constraints, cascades, and triggers.

3. **Isolation (Independent Execution):**
   - Ensures that concurrent transactions execute independently of each other. The intermediate state of a transaction is invisible to other transactions.

4. **Durability (Permanence):**
   - Guarantees that once a transaction has committed, it will remain saved in non-volatile memory (e.g., hard drive) even in the event of power loss or system crash.`
      },
      {
        id: "dbms-2",
        title: "Database Normalization Levels",
        difficulty: "Medium",
        tag: "Database Design",
        question: "Explain the different levels of Database Normalization (1NF, 2NF, 3NF, BCNF).",
        explanation: `### Normalization Goals:
Database normalization is the process of structuring relational tables to reduce data redundancy and eliminate anomalies (insertion, update, deletion).

1. **First Normal Form (1NF):**
   - Atomic values only (each cell must contain single, indivisible values).
   - No repeating groups of columns.

2. **Second Normal Form (2NF):**
   - Must be in 1NF.
   - Eliminates partial dependencies (non-prime attributes must depend on the *entire* primary key, not just part of it. Relevant for composite keys).

3. **Third Normal Form (3NF):**
   - Must be in 2NF.
   - Eliminates transitive dependencies (non-prime attributes must not depend on other non-prime attributes; "every attribute must depend on the key, the whole key, and nothing but the key").

4. **Boyce-Codd Normal Form (BCNF):**
   - A stronger version of 3NF.
   - For any dependency $X \\rightarrow Y$, $X$ must be a super key.`
      },
      {
        id: "dbms-3",
        title: "Primary Key vs Unique vs Foreign",
        difficulty: "Easy",
        tag: "Constraints",
        question: "What is the difference between a Primary Key, Unique Key, and Foreign Key?",
        explanation: `### Key Constraints Comparison:

| Feature | Primary Key | Unique Key | Foreign Key |
| :--- | :--- | :--- | :--- |
| **Purpose** | Uniquely identifies a record in a table. | Ensures all values in a column are distinct. | Creates a link/relationship between two tables by referencing a primary key in another table. |
| **Null Values** | Cannot contain \`NULL\` values. | Can contain one \`NULL\` value (usually). | Can contain multiple \`NULL\` values unless specified otherwise. |
| **Count** | Limit of 1 per table. | Multiple unique keys allowed per table. | Multiple foreign keys allowed per table. |
| **Clustered Index** | Automatically creates a clustered index by default. | Creates a non-clustered index by default. | Does not automatically create indexes (though recommended). |`
      },
      {
        id: "dbms-4",
        title: "Database Indexing Pros & Cons",
        difficulty: "Medium",
        tag: "Performance",
        question: "What is a database Index? What are the pros and cons of using indexes?",
        explanation: `### What is an Index?
An index is a data structure (typically a B-Tree or B+ Tree) that stores pointer references pointing to database rows, optimizing data retrieval speeds.

### Pros:
- **Fast Queries:** Dramatically speeds up \`SELECT\` queries, especially those with \`WHERE\`, \`ORDER BY\`, and \`JOIN\` clauses.
- **Uniqueness:** Helps enforce uniqueness constraints on database columns efficiently.

### Cons:
- **Write Overhead:** Slows down data modification queries (\`INSERT\`, \`UPDATE\`, \`DELETE\`) because the index must be rebuilt/updated.
- **Disk Space:** Indexes consume additional physical storage memory.

### Index Types:
- **Clustered Index:** Determines the physical order of data storage in the table (1 per table).
- **Non-Clustered Index:** Contains pointers to physical row addresses (Multiple per table).`
      },
      {
        id: "dbms-5",
        title: "DELETE vs TRUNCATE vs DROP",
        difficulty: "Easy",
        tag: "SQL Commands",
        question: "What is the difference between DELETE, TRUNCATE, and DROP commands?",
        explanation: `### Comparison Matrix:

| Feature | DELETE | TRUNCATE | DROP |
| :--- | :--- | :--- | :--- |
| **Type** | DML (Data Manipulation Language). | DDL (Data Definition Language). | DDL (Data Definition Language). |
| **Function** | Removes specific rows based on a \`WHERE\` clause. | Removes ALL rows from a table. Structure remains. | Deletes the entire table definition, schema, and rows. |
| **Rollback** | Can be rolled back if used inside a transaction. | Cannot be easily rolled back (varies by DB engine, auto-commits). | Cannot be rolled back. |
| **Speed** | Slower (logs deletions row-by-row). | Fast (deallocates database data pages). | Extremely Fast (deletes schema metadata). |
| **Triggers** | Fires DELETE triggers. | Does not fire triggers. | Does not fire triggers. |`
      },
      {
        id: "dbms-6",
        title: "Database Joins vs Subqueries",
        difficulty: "Medium",
        tag: "Queries",
        question: "When should you use Joins instead of Subqueries? Which is more efficient?",
        explanation: `### Joins vs Subqueries:

- **JOINS:**
  - Retrieve columns from multiple tables in a single query.
  - Generally compiled and optimized better by RDBMS query planners (using Hash Joins, Merge Joins, etc.).
  - Readability: Cleaner for combining relational tables.
- **SUBQUERIES (Nested Queries):**
  - Readability: Sometimes easier to write and conceptualize for complex step-by-step filtering.
  - Can be slow if the subquery is correlated (runs once for each row in the parent query).

### Rule of Thumb:
Use **Joins** for general operations as they are usually more efficient. Use **Subqueries** when checking for existence (\`EXISTS\`, \`IN\`) or performing calculations that must run before filtering main queries.`
      }
    ]
  },
  computernetwork: {
    title: "Computer Networks",
    description: "Learn OSI model layers, TCP/IP vs UDP, SSL handshake, DNS routing, and protocols.",
    icon: "🌐",
    questions: [
      {
        id: "cn-1",
        title: "OSI Model 7 Layers Explained",
        difficulty: "Medium",
        tag: "Architecture",
        question: "Explain the 7 layers of the OSI Model and their primary purposes.",
        explanation: `### The 7 Layers (Top to Bottom):

1. **Application Layer (Layer 7):**
   - Direct interaction with applications (HTTP, SMTP, FTP).
2. **Presentation Layer (Layer 6):**
   - Data formatting, encryption, decryption, and compression (SSL, ASCII, JPEG).
3. **Session Layer (Layer 5):**
   - Manages, establishes, and terminates connection sessions between devices.
4. **Transport Layer (Layer 4):**
   - End-to-end data delivery, flow control, and error correction (TCP, UDP).
5. **Network Layer (Layer 3):**
   - Determines optimal physical paths for routing packets (IP, Routers, ICMP).
6. **Data Link Layer (Layer 2):**
   - Frame formatting, physical MAC addressing, error detection on physical link (Switches, Ethernet).
7. **Physical Layer (Layer 1):**
   - Raw binary transmission over cables, wireless signals (Cables, Hubs, Bits).`
      },
      {
        id: "cn-2",
        title: "TCP vs UDP Protocols",
        difficulty: "Easy",
        tag: "Protocols",
        question: "What is the difference between TCP and UDP? When would you use each?",
        explanation: `### Key Differences:

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection** | Connection-oriented (Requires 3-way handshake). | Connectionless. |
| **Reliability** | Guaranteed delivery (Retransmits lost packets). | No guarantee. Packets can be lost or arrive out of order. |
| **Speed** | Slower (due to acknowledgment overhead). | Faster (no flow control or overhead). |
| **Header Size** | 20-60 bytes. | 8 bytes. |
| **Use Cases** | Web browsing (HTTP/HTTPS), File transfers (FTP), Email (SMTP). | Video streaming, Gaming, VoIP, DNS queries. |`
      },
      {
        id: "cn-3",
        title: "HTTPS TLS Handshake",
        difficulty: "Hard",
        tag: "Security",
        question: "How does HTTPS establish a secure connection? Explain the SSL/TLS handshake.",
        explanation: `### Step-by-Step SSL/TLS Handshake:

1. **Client Hello:**
   - The client sends supported TLS version, cipher suites, and a random string of bytes to the server.
2. **Server Hello & Certificate:**
   - The server replies with its SSL Certificate (containing the server's public key) and server random bytes.
3. **Authentication:**
   - The client verifies the SSL certificate with trusted Certificate Authorities (CAs).
4. **Pre-Master Secret:**
   - The client generates a random "pre-master secret" key, encrypts it with the server's public key, and sends it to the server.
5. **Key Decryption & Session Keys:**
   - The server decrypts the pre-master secret using its private key.
   - Both client and server calculate the symmetric **Session Key** using the pre-master secret and random byte strings.
6. **Finished:**
   - Client and server exchange encrypted messages confirming handshake success. All subsequent data transmission is encrypted using the symmetric Session Key.`
      },
      {
        id: "cn-4",
        title: "DNS Resolution Flow",
        difficulty: "Medium",
        tag: "Domain Resolution",
        question: "What is the Domain Name System (DNS) and how does it resolve a domain name?",
        explanation: `### DNS Resolution Steps:
When you search for \`google.com\` in a browser:

1. **Local Check:** The browser check local cache, then the OS checks host files.
2. **Recursive Resolver:** If not cached, the query is sent to your ISP's DNS Resolver.
3. **Root Nameserver:** The resolver queries the Root Nameserver (\`.\`), which returns the address of the Top-Level Domain (TLD) server (e.g. \`.com\`).
4. **TLD Nameserver:** The resolver queries the TLD Nameserver, which provides the IP address of the Domain's Authoritative Nameserver.
5. **Authoritative Nameserver:** The resolver queries the Authoritative Nameserver, which returns the exact IP address of the destination server.
6. **Caching:** The resolver caches the IP and sends it back to your browser to load the website.`
      },
      {
        id: "cn-5",
        title: "IPv4 vs IPv6 Addressing",
        difficulty: "Easy",
        tag: "IP Addressing",
        question: "What are the primary differences between IPv4 and IPv6?",
        explanation: `### Key Differences:

| Feature | IPv4 | IPv6 |
| :--- | :--- | :--- |
| **Address Size** | 32-bit address. | 128-bit address. |
| **Address Format** | Numeric (dotted-decimal): e.g. \`192.168.1.1\`. | Alphanumeric (hexadecimal): e.g. \`2001:db8::ff00:42:8329\`. |
| **Address Space** | $2^{32} \\approx 4.3$ billion addresses (exhausted). | $2^{128} \\approx 340$ undecillion addresses. |
| **Configuration** | Manual configuration or DHCP. | Auto-configuration (stateless address autoconfiguration). |
| **Security** | Security is optional (IPSec). | IPSec support is built-in and mandatory. |`
      },
      {
        id: "cn-6",
        title: "Cookies vs Sessions",
        difficulty: "Easy",
        tag: "Web Architecture",
        question: "What is the difference between Cookies and Sessions in web applications?",
        explanation: `### Cookies vs Sessions:

- **COOKIES:**
  - Stored on the **Client-side** (browser).
  - Sent to the server automatically with every HTTP request.
  - Security: Vulnerable to tampering and cross-site scripting (XSS) unless marked \`HttpOnly\` and \`Secure\`.
  - Size Limit: Usually limited to 4KB of data.
- **SESSIONS:**
  - Stored on the **Server-side** (in database, file system, or RAM cache like Redis).
  - Client only stores a Session ID (usually in a cookie) to authenticate requests.
  - Security: More secure because data is stored on the server.
  - Size Limit: Virtually unlimited (bound by server memory capacity).`
      }
    ]
  },
  sql: {
    title: "SQL Queries & Syntax",
    description: "Write and optimize relational queries, joins, aggregates, subqueries, and window functions.",
    icon: "💾",
    questions: [
      {
        id: "sql-1",
        title: "Understanding SQL Joins",
        difficulty: "Easy",
        tag: "Joins",
        question: "Explain the different types of SQL Joins (INNER, LEFT, RIGHT, FULL OUTER).",
        explanation: `### SQL Join Types:

1. **INNER JOIN:**
   - Returns records that have matching values in both tables.
   \`\`\`sql
   SELECT * FROM Users INNER JOIN Orders ON Users.id = Orders.user_id;
   \`\`\`

2. **LEFT (OUTER) JOIN:**
   - Returns all records from the left table, and matching records from the right table. If no match, returns \`NULL\` for the right table columns.
   \`\`\`sql
   SELECT * FROM Users LEFT JOIN Orders ON Users.id = Orders.user_id;
   \`\`\`

3. **RIGHT (OUTER) JOIN:**
   - Returns all records from the right table, and matching records from the left table. If no match, returns \`NULL\` for the left table columns.
   \`\`\`sql
   SELECT * FROM Users RIGHT JOIN Orders ON Users.id = Orders.user_id;
   \`\`\`

4. **FULL (OUTER) JOIN:**
   - Returns all records when there is a match in either left or right table.
   \`\`\`sql
   SELECT * FROM Users FULL OUTER JOIN Orders ON Users.id = Orders.user_id;
   \`\`\``
      },
      {
        id: "sql-2",
        title: "WHERE vs HAVING Clauses",
        difficulty: "Easy",
        tag: "Filtering",
        question: "What is the difference between WHERE and HAVING clauses in SQL?",
        explanation: `### Key Differences:

- **WHERE Clause:**
  - Filters rows **before** groups/aggregations are computed.
  - Cannot be used with aggregate functions (e.g. \`SUM\`, \`COUNT\`, \`AVG\`).
  - *Example:*
    \`\`\`sql
    SELECT * FROM Employees WHERE department = 'Sales';
    \`\`\`

- **HAVING Clause:**
  - Filters groups/results **after** \`GROUP BY\` has been executed.
  - Used specifically to filter aggregate fields.
  - *Example:*
    \`\`\`sql
    SELECT department, COUNT(*) FROM Employees 
    GROUP BY department 
    HAVING COUNT(*) > 5;
    \`\`\``
      },
      {
        id: "sql-3",
        title: "SQL Window Functions",
        difficulty: "Medium",
        tag: "Advanced SQL",
        question: "How do window functions work? Give an example of ROW_NUMBER() or RANK().",
        explanation: `### Definition:
A window function performs calculations across a set of table rows that are related to the current row. Unlike aggregate functions, window functions do not collapse rows; each row retains its unique identity.

### Syntax:
\`\`\`sql
FUNCTION() OVER (PARTITION BY column ORDER BY column)
\`\`\`

### Example (Rank Salaries in Departments):
\`\`\`sql
SELECT name, department, salary,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank
FROM Employees;
\`\`\`

### Difference:
- \`ROW_NUMBER()\` assigns sequential integer numbers starting at 1, even if values are duplicate.
- \`RANK()\` assigns duplicate ranks for identical values, leaving gaps in subsequent ranks (e.g. 1, 2, 2, 4).`
      },
      {
        id: "sql-4",
        title: "Correlated vs Normal Subqueries",
        difficulty: "Medium",
        tag: "Subqueries",
        question: "What is the difference between a correlated and a non-correlated subquery?",
        explanation: `### Non-Correlated Subquery:
- Independent of the outer query.
- Executed exactly once. The outer query uses its static result.
- *Example:*
  \`\`\`sql
  SELECT * FROM Employees 
  WHERE salary > (SELECT AVG(salary) FROM Employees);
  \`\`\`

### Correlated Subquery:
- Depends on columns from the outer query.
- Executed repeatedly—once for every row processed by the outer query. Can be slow on large datasets.
- *Example (Find employees who earn more than the average of their specific department):*
  \`\`\`sql
  SELECT e1.name, e1.salary 
  FROM Employees e1
  WHERE e1.salary > (
      SELECT AVG(e2.salary) 
      FROM Employees e2 
      WHERE e2.department = e1.department
  );
  \`\`\``
      },
      {
        id: "sql-5",
        title: "Query Second Highest Salary",
        difficulty: "Medium",
        tag: "Queries",
        question: "How do you find the second highest salary of an employee using SQL?",
        explanation: `### Method 1: Using SUBQUERY (Database Independent)
Find the maximum salary that is strictly less than the absolute maximum salary.
\`\`\`sql
SELECT MAX(salary) AS SecondHighestSalary 
FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);
\`\`\`

### Method 2: Using LIMIT / OFFSET (MySQL, PostgreSQL)
Sort salaries descending, skip the first row, and take the next row.
\`\`\`sql
SELECT DISTINCT salary AS SecondHighestSalary 
FROM Employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;
\`\`\`

### Method 3: Using Window Function (DENSE_RANK)
\`\`\`sql
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk
    FROM Employees
)
SELECT DISTINCT salary AS SecondHighestSalary 
FROM RankedSalaries 
WHERE rnk = 2;
\`\`\``
      },
      {
        id: "sql-6",
        title: "Views vs Materialized Views",
        difficulty: "Medium",
        tag: "Views",
        question: "What is the difference between a standard View and a Materialized View?",
        explanation: `### Comparison:

- **STANDARD VIEW:**
  - A virtual table representing a saved query. It does NOT store data physically on disk.
  - When referenced, the query runs in real-time.
  - Pros: Always returns fresh data; takes no disk space.
  - Cons: Performance overhead on complex queries.

- **MATERIALIZED VIEW:**
  - Physically stores the result of the query on disk.
  - Must be refreshed manually or on a schedule (\`REFRESH MATERIALIZED VIEW\`).
  - Pros: Super fast query speeds since data is precomputed.
  - Cons: Returns stale data if not recently refreshed; consumes disk space.`
      }
    ]
  }
};
