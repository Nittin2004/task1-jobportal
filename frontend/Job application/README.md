Yeh project basically ek Advanced Job Portal aur DSA Learning Platform ka combination hai, jiska naam "NextHire" (ya aapka diya hua naam) hai.

Is project ko is tarah se design kiya gaya hai ki yeh kisi bhi college ya placement cell ke liye, ya ek standalone startup ki tarah kaam aa sake. Niche project ka ek aasaan aur detail explanation diya gaya hai, jise aap apne resume, college presentation, ya interview mein use kar sakte hain:

1. Project Ka Main Idea Kya Hai?
Aam taur par candidates ko LeetCode par coding practice karni padti hai aur LinkedIn/Naukri par jobs dhundhni padti hai. Yeh project in dono platforms ka ek perfect mix hai. Ek hi platform par candidate apni Data Structures (DSA) ki preparation kar sakta hai (built-in compiler ke sath), aur apne performance/resume ke basis par top companies mein apply bhi kar sakta hai.

2. User Roles & Features (Kaun kya kar sakta hai?)
Platform ko teen alag-alag users ke hisaab se banaya gaya hai:

🧑‍🎓 Candidate (Student/Job Seeker)
Profile & Resume: Candidate apni profile set kar sakta hai aur apna resume upload kar sakta hai.
DSA Cheat Sheet (USP): Ek proper structured roadmap hai jisme 400 questions hain (Jaise Arrays, Strings, Trees). Isme ek Live Code Compiler hai jo backend se connect hokar testcases run karta hai (बिल्कुल LeetCode की तरह).
Freemium Model: Shuru ke basic questions free hain. Advance questions solve karne ke liye candidates ko Razorpay payment gateway ke through "Premium" membership leni padti hai.
Job Application: Candidate list hui jobs ko dekh sakta hai aur single click se apply kar sakta hai.
🏢 Company (Recruiter)
Job Posting: Companies apni profile banati hain aur naye job openings create karti hain.
Applicant Tracking: Unki post ki hui job par kis-kis ne apply kiya, unka resume dekhna, aur unhe "Shortlist" ya "Reject" karne ka option unke dashboard mein hota hai.
⚙️ Admin (Owner)
Platform Control: Admin poore portal par control rakhta hai. Kitne naye candidates aaye, kitni companies register hui, aur total kitni payment receive hui.
3. Tech Stack (Konsi Technology Use Hui Hai?)
Yeh project poori tarah se modern MERN Stack par based hai:

Frontend: React.js (Component based UI, React Router for navigation)
Backend: Node.js & Express.js (RESTful APIs create karne ke liye)
Database: MongoDB (Users, Jobs, aur Applications ka data store karne ke liye)
Authentication: JWT (JSON Web Tokens) se secure login.
Payment Gateway: Razorpay API for handling premium subscriptions.
Code Execution: Backend APIs integrate ki gayi hain jo C++, Java, Python, aur JavaScript code ko test cases ke against run karti hain.
Short me kahein toh: "Yeh ek MERN stack based EdTech + Hiring platform hai jahan students apna technical interview clear karne ki practice kar sakte hain aur vahin se seedha IT companies mein job apply kar sakte hain. Isme premium membership aur live code compiler jaise advanced features hain."

Agar aap chahein toh main is explanation ka ek proper README.md file (GitHub ke liye) ya ek PPT (Presentation) ka structure bhi bana kar de sakta hoon. Aap ise kahan use karna chahte hain?

4:59 PM
okay tume mujhe dsa sheet k e baare batao like compiler  me kaise code aa rha ha kaise question show ho rh eha koi api h jaha data fetch ho rhah ha explain
5:01 PM
DSA Sheet aur uska live Compiler is project ka sabse advanced hissa hai. Iske andar 3-4 cheezein ek sath judkar (integrate hokar) kaam kar rahi hain.

Main aapko step-by-step samajhata hoon ki yeh background mein kaise chal raha hai:

1. Questions Screen Par Kaise Show Ho Rahe Hain? (dsaData.js)
Frontend ke andar ek file hai src/data/dsaData.js. Is file mein lagbhag 400+ top DSA questions (jaise 'Two Sum', 'Reverse Integer') ki ek badi si Array/List bani hui hai.

Jab aap "DSA Sheet" page kholte hain, toh react directly is file se questions read karke table/list mein show kar deta hai. Yahan abhi koi API call nahi hoti, data statically file mein store hai.
Har question ke sath uska ek LeetCode Slug (URL identifier, jaise two-sum) save kiya hua hai.
2. Jab Question Par Click Karte Hain Toh Data Kahan Se Aata Hai?
Jab candidate kisi question (e.g. "Two Sum") par click karta hai, tab frontend ek request bhejta hai aapke Node.js backend par: http://localhost:5000/api/leetcode/two-sum

Aapka Backend (Node.js) ek tarah se "Middleman" ka kaam karta hai:

Backend, original LeetCode ke GraphQL API par chupke se request bhejta hai.
Wahan se woh 4 main cheezein nikal kar laata hai:
Content: Question ki puri HTML story (Given an array...).
Code Snippets: Woh initial code jo user ko compiler me likha hua dikhta hai (Jaise: vector<int> twoSum(vector<int>& nums) { ... }).
Example Testcases: [2,7,11,15] aur 9 jaise inputs.
MetaData: Function ka naam kya hai aur variables ka type kya hai.
3. Compiler Mein Code Kaise Aa Raha Hai? (DSACheatSheet.jsx)
Backend se jo response wapas aata hai, frontend usme se Code Snippet nikalta hai aur sidha aapke on-screen Code Editor (jo left/right panel me hai) ke andar daal deta hai. Isiliye aap C++, Java ya Python tab change karte hain toh automatically exact LeetCode jaisa code pehle se likha hua aa jata hai.

4. "Run Code" Karne Par Kya Hota Hai? (Judge0 API)
Jab user apna logic likhkar "Run Code" button dabata hai, toh process kuch aisi hoti hai:

Frontend aapka likha hua code aur testcase utha kar wapis Backend ko bhejta hai: /api/compiler/execute.
Driver Code Injection (Jo humne aaj banaya!): Backend ko pata hai ki aapne sirf twoSum function likha hai. Toh backend automatically ek hidden int main() ya Driver Code generate karke aapke code ke niche jod (append) deta hai jo inputs ko theek se read kar sake.
Judge0 API (The Core Compiler): Aapka backend is final ready code ko internet par Judge0 API ko bhejta hai. Judge0 ek cloud service hai jo kisi bhi language ka code execute karti hai.
Judge0 code run karta hai aur output ([0,1]) wapas bhejta hai. Frontend use testcase se compare karta hai aur green rang mein "Accepted" show kar deta hai!
Short Summary: Questions local file se aate hain ➡️ Question details aur boiler-plate code live LeetCode API se fetch hota hai ➡️ Code execute karne ka kaam Judge0 API karti hai.