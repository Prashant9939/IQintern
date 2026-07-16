const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern';
const templatesDir = path.join(workspaceDir, 'public', 'templates', 'default');
const dbTemplatePath = path.join(workspaceDir, 'scratch', 'db_project_report.html');

if (!fs.existsSync(dbTemplatePath)) {
  console.error("Database template copy not found at:", dbTemplatePath);
  process.exit(1);
}

const templateContent = fs.readFileSync(dbTemplatePath, 'utf8');

// Dictionary of track-specific content
const trackContents = {
  'Data Science': {
    abstract: 'This report details the exploratory data analysis, dataset cleanups, and statistical modeling workflows completed during the Data Science internship. Using Python and pandas libraries, we analysed data distributions, correlation metrics, and designed validation models.',
    introduction: 'The field of Data Science combines mathematical models, database querying, and programming tools to solve predictive operations. Over this track, the candidate analysed noisy datasets, created visual representations of variables, and evaluated correlation vectors.',
    weeklyProgress: 'Weekly activities consisted of loading CSV databases, executing data cleaning routines, filtering outlier vectors, plotting correlation charts, and implementing basic regression and classification metrics.',
    technologies: 'Python, Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn, SQL, Jupyter Notebooks',
    challenges: 'Handling missing value records, optimizing database join speeds, managing model overfitting, and adjusting hyperparameter weights.',
    conclusion: 'The data science evaluations proved that the candidate is capable of preparing datasets, analyzing statistical features, and designing basic data pipeline analytics workflows.',
    tasks: [
      { name: 'Data Cleansing', desc: 'Handled missing values, filtered outlier data points, and normalized variables.', status: 'Completed' },
      { name: 'EDA and Plotting', desc: 'Generated correlation matrices and statistical distribution plots.', status: 'Completed' },
      { name: 'Model Evaluation', desc: 'Trained regression algorithms and evaluated R2 scores.', status: 'Completed' }
    ]
  },
  'Python Programming': {
    abstract: 'This report covers core OOP design patterns, backend script development, and database integrations implemented during the Python Programming internship. The candidate focused on constructing clean modular algorithms and automated routing.',
    introduction: 'Python is a core language for automation, scripting, and backend API structures. This track focused on establishing strong algorithm designs, file operations, and SQL database connector integrations.',
    weeklyProgress: 'Weekly tasks included writing classes, structuring unit tests, implementing exceptions handling, routing file I/O operations, and connecting SQLite database models.',
    technologies: 'Python 3, Django, Flask, SQLite, Unittest, Pip Package Manager, Git',
    challenges: 'Managing package version dependency clashes, refactoring nested loops for time complexity, and automating DB schema migrations.',
    conclusion: 'The candidate demonstrated proficiency in building modular Python backends, integrating database schemas, and writing automated unit tests.',
    tasks: [
      { name: 'OOP Scripting', desc: 'Designed modular backend routing classes and exception systems.', status: 'Completed' },
      { name: 'SQLite Connection', desc: 'Integrated SQLite DB connector pipelines for CRUD transactions.', status: 'Completed' },
      { name: 'Unit Testing', desc: 'Wrote testing suites to verify algorithm performance and exceptions.', status: 'Completed' }
    ]
  },
  'Web Development': {
    abstract: 'This report documents the responsive frontend architectures, REST API controllers, and state management systems implemented during the Web Development internship using modern JavaScript frameworks.',
    introduction: 'Web development bridges user interface designs with server transactions. The candidate built responsive layouts using CSS flexbox/grid, connected frontend inputs with REST endpoints, and managed browser state lifecycles.',
    weeklyProgress: 'Weekly progress focused on designing layouts, coding responsive navigation blocks, integrating API fetch transactions, handling form validations, and routing pages.',
    technologies: 'HTML5, CSS3, JavaScript ES6, React.js, Next.js, TailwindCSS, Git',
    challenges: 'Adapting layouts for small screens, handling asynchronous state updates, and optimizing asset sizes for fast browser rendering.',
    conclusion: 'The evaluations show the candidate is fully capable of designing user interfaces, routing client state, and connecting web frontends to backend APIs.',
    tasks: [
      { name: 'Frontend Design', desc: 'Constructed responsive navigation, grid systems, and layout states.', status: 'Completed' },
      { name: 'API Routing', desc: 'Built asynchronous fetch workflows to send client logs to backend endpoints.', status: 'Completed' },
      { name: 'State Management', desc: 'Implemented React hook workflows to monitor user interactions.', status: 'Completed' }
    ]
  },
  'Java Development': {
    abstract: 'This report details the object-oriented design, servlet controllers, and SQL database transactions completed during the Java Development internship using Spring Framework structures.',
    introduction: 'Java is an industry-standard language for enterprise backends and robust server applications. The candidate configured REST controllers, designed database schemas, and resolved concurrency logs.',
    weeklyProgress: 'Weekly assignments consisted of implementing inheritance interfaces, writing JDBC query scripts, configuring servlets, and debugging memory allocation pools.',
    technologies: 'Java JDK, Spring Boot, Hibernate ORM, Maven, MySQL, JUnit',
    challenges: 'Resolving thread lock issues, handling SQL exception states, and configuring Maven build dependencies.',
    conclusion: 'The candidate proved their capability to structure large-scale Java backend architectures, map databases via ORM, and compile secure enterprise endpoints.',
    tasks: [
      { name: 'ORM Integration', desc: 'Mapped DB entities using Hibernate and structured SQL join criteria.', status: 'Completed' },
      { name: 'API Servlets', desc: 'Configured Spring Boot REST controllers for secure client auth transactions.', status: 'Completed' },
      { name: 'Thread Profiling', desc: 'Analyzed concurrency threads and resolved locking latency issues.', status: 'Completed' }
    ]
  },
  'Artificial Intelligence': {
    abstract: 'This report details the deep learning model training, computer vision integrations, and neural network setups completed during the Artificial Intelligence internship.',
    introduction: 'Artificial Intelligence systems process sensory inputs to make predictive classifications. The candidate trained deep neural network models, parsed video/image streams, and evaluated neural node weights.',
    weeklyProgress: 'Weekly progress included assembling train/test datasets, configuring convolutional layers, applying data augmentations, and evaluating classification maps.',
    technologies: 'Python, TensorFlow, PyTorch, OpenCV, Jupyter Notebook, Kaggle Datasets',
    challenges: 'High computing times during neural training, adjusting gradient descent weights, and parsing noise from camera frames.',
    conclusion: 'The candidate demonstrated capability in computer vision parsing, model layer configurations, and neural network performance optimization.',
    tasks: [
      { name: 'Layer Configuration', desc: 'Configured CNN pooling layers for precise feature map extractions.', status: 'Completed' },
      { name: 'OpenCV Parsing', desc: 'Wrote image processing filters to isolate and threshold shapes in frames.', status: 'Completed' },
      { name: 'Neural Tuning', desc: 'Adjusted learning rates to optimize cross-entropy loss metrics.', status: 'Completed' }
    ]
  },
  'Machine Learning': {
    abstract: 'This report documents the dataset preprocessing, regression tuning, and prediction modeling pipelines built during the Machine Learning internship.',
    introduction: 'Machine Learning focuses on algorithms that learn from structured data to make decisions. The candidate configured feature selectors, trained linear/classification trees, and calculated performance confusion matrices.',
    weeklyProgress: 'Weekly items included loading numerical databases, executing normalization vectors, training decision tree nodes, and measuring precision/recall values.',
    technologies: 'Python, Scikit-Learn, Pandas, NumPy, XGBoost, Matplotlib',
    challenges: 'Correcting heavily skewed class balances, removing high-multicollinearity variables, and optimizing decision node split depths.',
    conclusion: 'The evaluations show the candidate is skilled at feature engineering, model selection, and dataset accuracy calibration.',
    tasks: [
      { name: 'Feature Selection', desc: 'Evaluated information gain weights to select high-impact prediction variables.', status: 'Completed' },
      { name: 'Tree Classification', desc: 'Trained random forest ensembles and plotted decision splits.', status: 'Completed' },
      { name: 'Validation Checks', desc: 'Calculated precision, recall, and ROC-AUC curve scores.', status: 'Completed' }
    ]
  },
  'Cyber Security': {
    abstract: 'This report covers network traffic auditing, port scans, security firewall rule setups, and vulnerability assessments completed during the Cyber Security internship.',
    introduction: 'Cyber security focuses on shielding network infrastructure and digital data from threat vectors. The candidate mapped network ports, audited software vulnerabilities, and researched cryptographic encryptions.',
    weeklyProgress: 'Weekly tasks focused on logging network traffic packages, scanning open ports, identifying service versions, and auditing web app authentication flows.',
    technologies: 'Wireshark, Metasploit, Nmap, Cryptography tools, Kali Linux, Firewalls',
    challenges: 'Differentiating harmless logs from actual threat vectors, firewall bypass simulations, and configuring secure keys.',
    conclusion: 'The evaluations confirm the candidate can perform basic security audits, trace threat footprints in traffic logs, and structure firewall security rules.',
    tasks: [
      { name: 'Network Scanning', desc: 'Mapped open ports and scanned active OS versions using Nmap.', status: 'Completed' },
      { name: 'Traffic Analysis', desc: 'Parsed packet headers and identified insecure HTTP cleartext headers.', status: 'Completed' },
      { name: 'Firewall Auditing', desc: 'Configured port forwarding and iptables firewall security blocks.', status: 'Completed' }
    ]
  },
  'Cloud Computing': {
    abstract: 'This report documents server setups, microservice containerizations, and automated build pipelines architected during the Cloud Computing internship.',
    introduction: 'Cloud infrastructures provide scalable hosting and serverless application backends. The candidate containerized modular code blocks, routed load balancer configurations, and configured resource monitors.',
    weeklyProgress: 'Weekly milestones included writing Dockerfiles, launching VM containers, routing virtual private networks, and setting up automated CI/CD code builds.',
    technologies: 'Amazon Web Services (AWS), Docker, Kubernetes, Linux CLI, GitHub Actions, Nginx',
    challenges: 'Balancing microservice routing, optimizing container image sizes, and troubleshooting network firewall permissions.',
    conclusion: 'The candidate is skilled at virtual infrastructure deployment, container image packaging, and setting up CI/CD workflows.',
    tasks: [
      { name: 'Dockerization', desc: 'Wrote multi-stage Dockerfiles to containerize Node backends securely.', status: 'Completed' },
      { name: 'AWS Orchestration', desc: 'Deployed virtual servers inside custom security group firewalls.', status: 'Completed' },
      { name: 'Pipeline Scripting', desc: 'Wrote YAML pipelines to trigger automated tests on main branch push.', status: 'Completed' }
    ]
  },
  'UI/UX Design': {
    abstract: 'This report covers user persona research, low-fidelity wireframing, high-fidelity UI prototyping, and usability evaluations conducted during the UI/UX Design internship.',
    introduction: 'UI/UX design is focused on creating digital interfaces that are intuitive, accessible, and align with user goals. The candidate researched flow charts, designed design systems, and verified accessibility standards.',
    weeklyProgress: 'Weekly assignments included drafting user journeys, creating layout frames, structuring component libraries, and testing button interactions.',
    technologies: 'Figma, Adobe XD, Component Libraries, UI Kits, Accessibility Checkers',
    challenges: 'Aligning visual aesthetics with accessibility contrast requirements, and designing responsive components.',
    conclusion: 'The candidate proved their capability to map user flows, build consistent high-fidelity UI components, and design responsive screens.',
    tasks: [
      { name: 'Layout Mapping', desc: 'Drafted responsive wireframes for desktop, tablet, and mobile views.', status: 'Completed' },
      { name: 'Design Systems', desc: 'Created reusable component libraries with unified typography styles.', status: 'Completed' },
      { name: 'Flow Prototyping', desc: 'Linked screens in Figma with interactive transitions and click triggers.', status: 'Completed' }
    ]
  },
  'UI/UX Product Design': {
    abstract: 'This report covers user persona research, low-fidelity wireframing, high-fidelity UI prototyping, and usability evaluations conducted during the UI/UX Product Design internship.',
    introduction: 'UI/UX design is focused on creating digital interfaces that are intuitive, accessible, and align with user goals. The candidate researched flow charts, designed design systems, and verified accessibility standards.',
    weeklyProgress: 'Weekly assignments included drafting user journeys, creating layout frames, structuring component libraries, and testing button interactions.',
    technologies: 'Figma, Adobe XD, Component Libraries, UI Kits, Accessibility Checkers',
    challenges: 'Aligning visual aesthetics with accessibility contrast requirements, and designing responsive components.',
    conclusion: 'The candidate proved their capability to map user flows, build consistent high-fidelity UI components, and design responsive screens.',
    tasks: [
      { name: 'Layout Mapping', desc: 'Drafted responsive wireframes for desktop, tablet, and mobile views.', status: 'Completed' },
      { name: 'Design Systems', desc: 'Created reusable component libraries with unified typography styles.', status: 'Completed' },
      { name: 'Flow Prototyping', desc: 'Linked screens in Figma with interactive transitions and click triggers.', status: 'Completed' }
    ]
  },
  'Digital Marketing': {
    abstract: 'This report documents search engine optimization (SEO) audits, key traffic analytics tracking, and social ad funnel planning completed during the Digital Marketing internship.',
    introduction: 'Digital Marketing monitors and optimizes user touchpoints online to maximize audience conversion. The candidate analysed traffic sources, drafted search keywords, and tracked user funnels.',
    weeklyProgress: 'Weekly achievements consisted of keyword mapping, SEO audit reports, UTM link configurations, conversion rate metrics checks, and email mockup designs.',
    technologies: 'Google Analytics, Google Search Console, SEMrush, Meta Ads Manager, Mailchimp',
    challenges: 'Adapting to shifting search keywords, managing ad budget caps, and optimizing email open-rate metrics.',
    conclusion: 'The candidate has proved they can conduct search optimization audits, analyze web traffic logs, and structure structured online ad funnels.',
    tasks: [
      { name: 'SEO Auditing', desc: 'Analyzed page load times, meta description counts, and mapped main keywords.', status: 'Completed' },
      { name: 'Funnel Tracking', desc: 'Configured conversion metrics to log user actions across signups.', status: 'Completed' },
      { name: 'Content Strategy', desc: 'Drafted visual ad assets and scheduled social media campaign copy.', status: 'Completed' }
    ]
  },
  'Human Resources (HR)': {
    abstract: 'This report covers applicant sourcing, talent vetting, onboarding journey mappings, and corporate policy drafting completed during the Human Resources internship.',
    introduction: 'Human Resources manages talent recruitment, employee performance lifecycles, and policy structures. The candidate sourced profiles, drafted screening assessments, and designed onboarding workflows.',
    weeklyProgress: 'Weekly progress included filtering resumes, structuring screening interview steps, mapping new hire workflows, and auditing policy guidelines.',
    technologies: 'LinkedIn Recruiter, Excel, Applicant Tracking Systems (ATS), Slack, HRIS tools',
    challenges: 'Identifying optimal candidate profiles for highly specialized technical tracks, and maximizing onboarding engagement.',
    conclusion: 'The candidate is fully capable of managing resume filters, talent sourcing logs, and structuring professional HR onboarding processes.',
    tasks: [
      { name: 'Talent Sourcing', desc: 'Screened candidate resumes and filtered skill markers in database.', status: 'Completed' },
      { name: 'Workflow Mapping', desc: 'Designed new hire documentation folders and onboarding schedules.', status: 'Completed' },
      { name: 'Policy Drafting', desc: 'Compiled workplace compliance guidelines and code-of-conduct sheets.', status: 'Completed' }
    ]
  },
  'Business Analytics': {
    abstract: 'This report details data visualization dashboard setups, SQL metric queries, and trend analyses completed during the Business Analytics internship.',
    introduction: 'Business Analytics translates raw business data into actionable KPIs. The candidate queried operational tables, mapped revenue metrics, and built interactive dashboards.',
    weeklyProgress: 'Weekly tasks focused on writing SQL queries, joining tables, assembling dashboard charts, and presenting customer segmentation trends.',
    technologies: 'Excel, SQL, Tableau, PowerBI, Google Data Studio',
    challenges: 'Merging data from multiple sources, choosing the correct charts to display complex data, and cleaning null values.',
    conclusion: 'The candidate demonstrated capability in data visualization, KPI dashboard design, and structured SQL database querying.',
    tasks: [
      { name: 'SQL Querying', desc: 'Wrote database query joins to compute month-over-month sales trends.', status: 'Completed' },
      { name: 'Dashboard Design', desc: 'Built Tableau charts showing customer location distributions.', status: 'Completed' },
      { name: 'KPI Reporting', desc: 'Drafted operational reports translating data charts to strategy suggestions.', status: 'Completed' }
    ]
  },
  'Political and Governance': {
    abstract: 'This report documents public data research, policy brief drafts, and governance frameworks audited during the Political and Governance internship.',
    introduction: 'Political and Governance research monitors policy implementation structures, legislative changes, and administrative systems. The candidate researched government files and parsed public feedback.',
    weeklyProgress: 'Weekly milestones included reading policy documents, summarizing legislative acts, profiling governance cases, and tracking public opinion metrics.',
    technologies: 'Government Portals, Legislative Search Engines, Policy research tools, Excel',
    challenges: 'Sourcing neutral data sets, parsing complex legal terminologies, and summarizing long legislative bills.',
    conclusion: 'The evaluations show the candidate can conduct policy audits, draft structural briefs, and analyze public administration systems.',
    tasks: [
      { name: 'Policy Auditing', desc: 'Read public infrastructure draft guidelines and compiled feedback points.', status: 'Completed' },
      { name: 'Legislative Analysis', desc: 'Summarized structural changes in municipal administration acts.', status: 'Completed' },
      { name: 'Brief Writing', desc: 'Drafted clear governance briefs outlining recommendations for digital programs.', status: 'Completed' }
    ]
  },
  'Tourism & Hospitality': {
    abstract: 'This report documents customer feedback profiling, logistics mapping, and destination itinerary designs completed during the Tourism & Hospitality internship.',
    introduction: 'Tourism & Hospitality manages customer journeys, logistics bookings, and service quality. The candidate structured itineraries, mapped customer feedback metrics, and analyzed service bottlenecks.',
    weeklyProgress: 'Weekly activities included destination profiling, customer review audits, lodging resource checks, and logistics coordination mappings.',
    technologies: 'Itinerary builders, Booking management software, CRM tools, Excel',
    challenges: 'Balancing travel times in itineraries, resolving lodging availability conflicts, and handling review comments.',
    conclusion: 'The evaluations confirm the candidate is skilled at itinerary design, service performance auditing, and logistics coordination.',
    tasks: [
      { name: 'Itinerary Design', desc: 'Created day-by-day travel itineraries with lodging and activity coordinates.', status: 'Completed' },
      { name: 'Feedback Auditing', desc: 'Compiled hotel satisfaction scores and highlighted service bottlenecks.', status: 'Completed' },
      { name: 'Logistics Mapping', desc: 'Structured transport schedules matching flight arrivals with taxi pickups.', status: 'Completed' }
    ]
  },
  'Entrepreneurship Skill Development': {
    abstract: 'This report covers business canvas creations, target market sizing (TAM/SAM), financial spreadsheet modeling, and pitch deck structures researched during the Entrepreneurship Skill Development internship.',
    introduction: 'Entrepreneurship focuses on validating startup viability, revenue structures, and customer profiles. The candidate drafted startup models, estimated market sizes, and built financial sheets.',
    weeklyProgress: 'Weekly milestones focused on filling out lean canvas models, calculating competitor shares, mapping sales funnels, and compiling investor pitch presentations.',
    technologies: 'Lean Canvas Tools, Excel, Pitch Deck Editors, Market Sizing resources',
    challenges: 'Finding credible industry reports for size estimates, structuring realistic pricing tiers, and defining customer acquisition costs.',
    conclusion: 'The evaluations show the candidate is fully capable of mapping startup architectures, validating models, and compiling investor materials.',
    tasks: [
      { name: 'Business Modeling', desc: 'Completed lean canvases detailing value propositions and key channels.', status: 'Completed' },
      { name: 'Market Sizing', desc: 'Calculated target addressable market (TAM) metrics using database resources.', status: 'Completed' },
      { name: 'Pitch Creation', desc: 'Structured pitch decks detailing competitor grids and pricing plans.', status: 'Completed' }
    ]
  },
  'Entrepreneurship': {
    abstract: 'This report covers business canvas creations, target market sizing (TAM/SAM), financial spreadsheet modeling, and pitch deck structures researched during the Entrepreneurship internship.',
    introduction: 'Entrepreneurship focuses on validating startup viability, revenue structures, and customer profiles. The candidate drafted startup models, estimated market sizes, and built financial sheets.',
    weeklyProgress: 'Weekly milestones focused on filling out lean canvas models, calculating competitor shares, mapping sales funnels, and compiling investor pitch presentations.',
    technologies: 'Lean Canvas Tools, Excel, Pitch Deck Editors, Market Sizing resources',
    challenges: 'Finding credible industry reports for size estimates, structuring realistic pricing tiers, and defining customer acquisition costs.',
    conclusion: 'The evaluations show the candidate is fully capable of mapping startup architectures, validating models, and compiling investor materials.',
    tasks: [
      { name: 'Business Modeling', desc: 'Completed lean canvases detailing value propositions and key channels.', status: 'Completed' },
      { name: 'Market Sizing', desc: 'Calculated target addressable market (TAM) metrics using database resources.', status: 'Completed' },
      { name: 'Pitch Creation', desc: 'Structured pitch decks detailing competitor grids and pricing plans.', status: 'Completed' }
    ]
  },
  'Teacher Training': {
    abstract: 'This report outlines curriculum research, lesson plan drafting, pedagogical models, and student assessment structures researched during the Teacher Training internship.',
    introduction: 'Teacher Training focuses on structuring learning pathways, applying classroom management techniques, and evaluating student performance metrics. The candidate drafted lesson plans and assessment rubrics.',
    weeklyProgress: 'Weekly targets consisted of writing lesson guides, choosing learning styles based on Bloom\'s Taxonomy, structuring grading sheets, and designing virtual classes.',
    technologies: 'Learning Management Systems (LMS), Bloom\'s Taxonomy kits, Virtual Classroom aids',
    challenges: 'Balancing time inside lesson plans, formatting clear assessment grading rubrics, and maximizing remote student interest.',
    conclusion: 'The evaluations confirm the candidate is skilled at curriculum design, structuring grading templates, and compiling effective pedagogical aids.',
    tasks: [
      { name: 'Lesson Planning', desc: 'Drafted lesson plans outlining learning targets and classroom aids.', status: 'Completed' },
      { name: 'Rubrics Creation', desc: 'Designed structured criteria charts for grading student projects.', status: 'Completed' },
      { name: 'LMS Configuration', desc: 'Uploaded modules, quizzes, and files to mock LMS class pages.', status: 'Completed' }
    ]
  },
  'Finance & Accounting': {
    abstract: 'This report details financial statement audits, spreadsheet ledger configs, and cash flow modeling completed during the Finance & Accounting internship.',
    introduction: 'Finance & Accounting monitors transaction flows, balances accounts, and prepares tax compliance logs. The candidate reconciled audit files, mapped balance sheet ledgers, and calculated cash flow forecasts.',
    weeklyProgress: 'Weekly assignments consisted of logging journal entries, reconciling ledger balances, auditing transaction invoices, and formatting budget statements.',
    technologies: 'Excel, Tally ERP, QuickBooks, Financial Modeling tools',
    challenges: 'Locating ledger audit discrepancies, managing dynamic financial formula links, and structuring depreciation schedules.',
    conclusion: 'The evaluations confirm the candidate can perform invoice reconciliations, audit transaction ledgers, and design basic financial statement sheets.',
    tasks: [
      { name: 'Ledger Audit', desc: 'Audited cash logs and reconciled transaction invoices against ledgers.', status: 'Completed' },
      { name: 'Financial Modeling', desc: 'Constructed three-statement financial models showing sales forecasts.', status: 'Completed' },
      { name: 'Statement Reconciling', desc: 'Balanced monthly assets, liabilities, and equity sections in sheet.', status: 'Completed' }
    ]
  }
};

const trackMapping = {
  'internship_data_science.html': 'Data Science',
  'internship_python.html': 'Python Programming',
  'internship_web_development.html': 'Web Development',
  'internship_java.html': 'Java Development',
  'internship_artificial_intelligence.html': 'Artificial Intelligence',
  'internship_machine_learning.html': 'Machine Learning',
  'internship_cyber_security.html': 'Cyber Security',
  'internship_cloud_computing.html': 'Cloud Computing',
  'internship_ui_ux.html': 'UI/UX Design',
  'internship_digital_marketing.html': 'Digital Marketing',
  'internship_hr.html': 'Human Resources (HR)',
  'internship_human_resources_hr.html': 'Human Resources (HR)',
  'internship_business_analytics.html': 'Business Analytics',
  'internship_political_and_governance.html': 'Political and Governance',
  'internship_tourism.html': 'Tourism & Hospitality',
  'internship_tourism__hospitality.html': 'Tourism & Hospitality',
  'internship_skill_development.html': 'Entrepreneurship Skill Development',
  'internship_teacher_trainning.html': 'Teacher Training',
  'internship_finance__accounting.html': 'Finance & Accounting',
  'internship_entrepreneurship.html': 'Entrepreneurship',
  'internship_uiux_product_design.html': 'UI/UX Product Design'
};

console.log("Generating customized 22-page report templates for each track...");

let generatedCount = 0;
for (const [filename, trackName] of Object.entries(trackMapping)) {
  const filePath = path.join(templatesDir, filename);
  
  // Skip if we deleted it in the clean up step to keep clean
  if (!fs.existsSync(filePath)) {
    // If it's a dynamic template, we generate it on demand so no need to create it here
    continue;
  }

  const trackData = trackContents[trackName] || trackContents['Web Development']; // fallback
  
  let trackHtml = templateContent;
  
  // Customize the title tag
  trackHtml = trackHtml.replace(/<title>Internship Report<\/title>/g, `<title>${trackName} Internship Report - IQ Intern</title>`);
  
  // Customize dynamic placeholders with track-specific text
  trackHtml = trackHtml.replace(/\{\{\s*INTERNSHIP_TITLE\s*\}\}/g, trackName);
  trackHtml = trackHtml.replace(/\{\{\s*internshipTitle\s*\}\}/g, trackName);
  trackHtml = trackHtml.replace(/\{\{\s*internshipName\s*\}\}/g, trackName);

  // Customize JavaScript sections inside HTML
  const customScript = `
/* =====================================================
   REPORT SECTIONS
===================================================== */

const sections = [
    "Abstract",
    "Acknowledgement",
    "Introduction",
    "Objectives",
    "Literature Review",
    "Weekly Progress",
    "Technologies Used",
    "Challenges Faced",
    "Results & Discussion",
    "Conclusion"
];

const sectionParagraphs = {
  "Abstract": "${trackData.abstract}",
  "Acknowledgement": "I express my sincere gratitude to the evaluation board at IQ Intern Vocational Training platform for their guidance during the project cycles. Special thanks to the mentors and project coordinators for structured guidance.",
  "Introduction": "${trackData.introduction}",
  "Objectives": "The objectives of this project were to apply core industry practices, implement scalable software engineering models, handle complex system diagnostics, and validate performance indicators under proctored evaluations.",
  "Literature Review": "Recent developments in industrial software processes highlight the importance of containerization, agile scripting models, structured analytics dashboards, and proctored grading structures to verify practical competencies.",
  "Weekly Progress": "${trackData.weeklyProgress}",
  "Technologies Used": "The tools and runtime environments utilized during the evaluations include: ${trackData.technologies}.",
  "Challenges Faced": "${trackData.challenges}",
  "Results & Discussion": "The final evaluation registers metrics indicating stable operational understanding. The proctored assessments verified the candidate's understanding of system parameters and logic components.",
  "Conclusion": "${trackData.conclusion}"
};

const sampleParagraph = \`\${sectionParagraphs["Introduction"]}\`;

const reportContainer = document.body;

/* =====================================================
   GENERATE SEPARATE A4 PAGES
===================================================== */

sections.forEach(section => {

    const page = document.createElement('div');

    page.className = 'report-page';

    // Get track specific table rows
    let tableRows = '';
    const taskList = [
      { name: "${trackData.tasks[0].name}", desc: "${trackData.tasks[0].desc}", status: "${trackData.tasks[0].status}" },
      { name: "${trackData.tasks[1].name}", desc: "${trackData.tasks[1].desc}", status: "${trackData.tasks[1].status}" },
      { name: "${trackData.tasks[2].name}", desc: "${trackData.tasks[2].desc}", status: "${trackData.tasks[2].status}" }
    ];

    taskList.forEach(task => {
      tableRows += \`
        <tr>
          <td>\${task.name}</td>
          <td>\${task.desc}</td>
          <td>\${task.status}</td>
        </tr>
      \`;
    });

    page.innerHTML = \`

        <h1>\${section}</h1>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <h2>\${section} Analysis</h2>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <table>

            <thead>

                <tr>

                    <th>Task</th>

                    <th>Description</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>
               \${tableRows}
            </tbody>

        </table>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

        <p>\${sectionParagraphs[section] || sampleParagraph}</p>

    \`;

    reportContainer.appendChild(page);

});
`;

  // Locate and replace script tag content
  const scriptRegex = /<script>([\s\S]*?)<\/script>/;
  trackHtml = trackHtml.replace(scriptRegex, `<script>${customScript}</script>`);
  
  fs.writeFileSync(filePath, trackHtml, 'utf8');
  console.log(`Generated customized template: ${filename} for "${trackName}"`);
  generatedCount++;
}

console.log(`\nGeneration complete! Customized ${generatedCount} track-specific report templates.`);
