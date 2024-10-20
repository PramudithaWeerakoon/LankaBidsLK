<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LankaBidsLK - README</title>
</head>
<body>
  <h1 align="center">LankaBidsLK</h1>
  <p align="center">An innovative, secure bidding platform designed for Sri Lanka, offering a reliable marketplace.</p>

  <h2>🚀 Features</h2>
  <ul>
    <li><strong>Bidding System:</strong> Users can securely bid on various products.</li>
    <li><strong>Real-Time Updates:</strong> Get live updates on bidding status.</li>
    <li><strong>User Profiles:</strong> Manage personal details and bidding history securely.</li>
    <li><strong>Secure Transactions:</strong> Integrated security protocols to prevent fraud and ensure safe payments.</li>
    <li><strong>Email Verification:</strong> Users must verify their email addresses during registration.</li>
    <li><strong>Two-Factor Authentication:</strong> Optional two-factor authentication for additional security.</li>
  </ul>

  <h2>🔐 Security Features</h2>
  <ul>
    <li><strong>SQL Injection Protection:</strong> Parameterized queries prevent SQL injection attacks.</li>
    <li><strong>Data Sanitization:</strong> Inputs are sanitized to prevent XSS and other vulnerabilities.</li>
    <li><strong>Password Encryption:</strong> All passwords are securely hashed and salted using bcrypt.</li>
    <li><strong>Secure Cookies:</strong> HTTP-only and Secure cookies protect session data in production.</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Users have different roles (Admin, Seller, Customer) with specific permissions.</li>
  </ul>

  <h2>🛠️ Technologies</h2>
  <ul>
    <li><strong>Next.js</strong> for the frontend.</li>
    <li><strong>Node.js</strong> and <strong>MySQL</strong> for backend and database management.</li>
    <li><strong>Prisma ORM</strong> for role-based access and database interaction.</li>
    <li><strong>Next-Auth</strong> for secure authentication and session management.</li>
    <li><strong>Tailwind CSS</strong> for responsive UI design.</li>
    <li><strong>Zod</strong> for input validation (front-end and back-end).</li>
  </ul>

  <h2>📦 How to Run</h2>
  <ol>
    <li>Clone the repository:
      <pre><code>git clone https://github.com/RyanSilva2004/LankaBidsLK.git</code></pre>
    </li>
    <li>Install dependencies:
      <pre><code>npm install</code></pre>
    </li>
    <li>Configure environment variables (e.g., database, Next-Auth secrets).</li>
    <li>Start the server:
      <pre><code>npm run dev</code></pre>
    </li>
    <li>Access the application at:
      <pre><code>http://localhost:3000</code></pre>
    </li>
  </ol>

  <h2>📈 Roadmap</h2>
  <ul>
    <li>Advanced Search Filters: Sort and filter bids by categories.</li>
    <li>Multi-Language Support: Sinhala, Tamil, and English interfaces.</li>
    <li>Mobile App: Future release of an Android/iOS version.</li>
    <li>Enhanced Payment Integrations: Support for multiple payment gateways.</li>
  </ul>

  <h2>👨‍💻 Contributing</h2>
  <p>Feel free to open issues or create pull requests to contribute!</p>

  <h2>🔗 Links</h2>
  <p><a href="https://github.com/RyanSilva2004/LankaBidsLK">Project Repository</a></p>

  <h2>🛡️ License</h2>
  <p>This project is licensed under the MIT License.</p>
</body>
</html>
