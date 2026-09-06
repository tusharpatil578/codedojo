import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Clearing database...');
  await prisma.achievement.deleteMany({});
  await prisma.supportMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.mentorSession.deleteMany({});
  await prisma.contestSubmission.deleteMany({});
  await prisma.contestQuestion.deleteMany({});
  await prisma.contest.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.courseLesson.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.courseProject.deleteMany({});
  await prisma.courseFeature.deleteMany({});
  await prisma.coursePrerequisite.deleteMany({});
  await prisma.courseOutcome.deleteMany({});
  await prisma.courseFAQ.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating users...');

  // Password for all users is "password123"
  const passwordHash = hashPassword('password123');

  // Admins
  const admin = await prisma.user.create({
    data: {
      email: 'admin@codedojo.com',
      passwordHash,
      name: 'Amit Patel',
      role: 'ADMIN',
      phone: '9876543210',
    },
  });

  // Instructors
  const rahul = await prisma.user.create({
    data: {
      email: 'rahul@codedojo.com',
      passwordHash,
      name: 'Rahul Sharma',
      role: 'INSTRUCTOR',
      phone: '9876543211',
    },
  });

  const shivank = await prisma.user.create({
    data: {
      email: 'shivank@codedojo.com',
      passwordHash,
      name: 'Shivank Agrawal',
      role: 'INSTRUCTOR',
      phone: '9876543212',
    },
  });

  // Mentors
  const siddharth = await prisma.user.create({
    data: {
      email: 'siddharth@codedojo.com',
      passwordHash,
      name: 'Siddharth Mehta',
      role: 'MENTOR',
      phone: '9876543213',
    },
  });

  const neha = await prisma.user.create({
    data: {
      email: 'neha@codedojo.com',
      passwordHash,
      name: 'Neha Kapoor',
      role: 'MENTOR',
      phone: '9876543214',
    },
  });

  console.log('Creating courses with detailed relations...');

  // 1. Data Analyst with Gen AI
  const daCourse = await prisma.course.create({
    data: {
      title: 'Data Analyst with Gen AI',
      slug: 'data-analyst-with-gen-ai',
      description: 'Analyze faster with AI-powered analytics. Master Excel, SQL, Python, Statistics, and Power BI while learning to implement real-world AI-assisted analytics workflows.',
      duration: '24 Weeks',
      price: 15999,
      priceOriginal: 29999,
      mode: 'Live',
      published: true,
      features: {
        create: [
          { text: 'Live Interactive Lectures', icon: 'Tv' },
          { text: 'AI-assisted BI Workflows', icon: 'Sparkles' },
          { text: 'Personal Profile Review & Job Prep', icon: 'Briefcase' },
          { text: '1-on-1 Mentorship Loops', icon: 'Users' }
        ]
      },
      prerequisites: {
        create: [
          { text: 'Basic computer literacy' },
          { text: 'High school mathematics and logic concepts' }
        ]
      },
      outcomes: {
        create: [
          { text: 'Develop business-critical analytical spreadsheets using Excel' },
          { text: 'Write highly optimized relational database SQL queries' },
          { text: 'Build interactive dashboards and tell visual business stories using Power BI' },
          { text: 'Employ GenAI tools to automate data cleaning, write SQL/Python, and outline findings' }
        ]
      },
      faqs: {
        create: [
          { question: 'Is there direct placement assistance?', answer: 'We offer extensive portfolio builders, resume tailoring, and direct mock reviews with mentors to help you crack analytical interviews.' },
          { question: 'What tools will I learn?', answer: 'Excel, PostgreSQL, Python, Pandas, NumPy, Power BI, and OpenAI API frameworks.' }
        ]
      },
      projects: {
        create: [
          {
            title: 'Sales Analytics Dashboard',
            problemStatement: 'Analyze raw transactional data to identify high-value customer groups and underperforming sales regions.',
            technologies: 'Excel, Power Query',
            skillsCovered: 'Data Modeling, Pivot Tables, KPIs',
            difficulty: 'EASY',
            outcome: 'Interactive dashboard showing key performance indicators and revenue trends.'
          },
          {
            title: 'Customer Retention & Cohort Analysis',
            problemStatement: 'Analyze subscriber log files to build cohort retention matrices and define churn triggers.',
            technologies: 'SQL, Python, Pandas',
            skillsCovered: 'CTEs, Cohort Calculations, Seaborn',
            difficulty: 'MEDIUM',
            outcome: 'Visual heatmap outlining monthly customer retention cohorts.'
          },
          {
            title: 'AI-Powered Business Intelligence',
            problemStatement: 'Deploy an automated pipeline that extracts insights from sales records and generates natural-language executive briefs.',
            technologies: 'Power BI, OpenAI API, Python',
            skillsCovered: 'API Integration, Context Management, Dashboards',
            difficulty: 'HARD',
            outcome: 'Power BI report with embedded GPT summary models.'
          }
        ]
      }
    }
  });

  // 2. Data Engineer with Gen AI
  const deCourse = await prisma.course.create({
    data: {
      title: 'Data Engineer with Gen AI',
      slug: 'data-engineer-with-gen-ai',
      description: 'Build modern data platforms and AI-ready pipelines. Master Advanced SQL, Data Warehousing, Airflow Orchestration, PySpark Big Data, and GCP cloud frameworks with agentic data tools.',
      duration: '32 Weeks',
      price: 19999,
      priceOriginal: 34999,
      mode: 'Live',
      published: true,
      features: {
        create: [
          { text: 'BigQuery Warehousing & Partitioning', icon: 'Database' },
          { text: 'ETL Pipelines using Apache Spark & Airflow', icon: 'GitBranch' },
          { text: 'Real-time GCP Dataflow Streams', icon: 'Activity' },
          { text: 'Agentic database pipelines and tool-use integration', icon: 'Cpu' }
        ]
      },
      prerequisites: {
        create: [
          { text: 'Basic knowledge of scripting (Python preferred)' },
          { text: 'Familiarity with SQL database tables' }
        ]
      },
      outcomes: {
        create: [
          { text: 'Architect highly scalable cloud data warehouses on GCP BigQuery' },
          { text: 'Implement robust orchestration workflows using Apache Airflow DAGs' },
          { text: 'Process massive datasets with Apache Spark and PySpark clustering' },
          { text: 'Build LLM-powered data extraction and structured outputs' }
        ]
      },
      faqs: {
        create: [
          { question: 'Why is GCP selected as the main cloud platform?', answer: 'GCP has industry-leading data engineering tools (BigQuery, Dataflow, Pub/Sub) that are ideal for training enterprise-level data engineers.' },
          { question: 'Do I get hands-on cloud access?', answer: 'Yes, you write analytical SQL queries that stream logs directly to Google BigQuery sandboxes.' }
        ]
      },
      projects: {
        create: [
          {
            title: 'End-to-End Orchestrated Pipeline',
            problemStatement: 'Scrape transactional records, process updates, and load clean data into a staging warehouse daily.',
            technologies: 'Python, PostgreSQL, Apache Airflow',
            skillsCovered: 'DAG Scheduling, Airflow Operators, Logging',
            difficulty: 'MEDIUM',
            outcome: 'Fully automated, fault-tolerant ETL pipeline with monitoring alerts.'
          },
          {
            title: 'Cloud Data Warehouse Architecture',
            problemStatement: 'Design a high-density analytics schema for a multi-million row ecommerce dataset.',
            technologies: 'GCP, BigQuery, dbt',
            skillsCovered: 'Star Schema, Partitioning, Query Tuning',
            difficulty: 'HARD',
            outcome: 'BigQuery warehouse with optimized SQL and dbt lineage rules.'
          },
          {
            title: 'Real-Time Logging Stream',
            problemStatement: 'Process high-velocity IoT messages, extract anomalies, and update live alerts dashboards with sub-second latency.',
            technologies: 'GCP Pub/Sub, Dataflow, Apache Beam',
            skillsCovered: 'Stream Pipelines, Windowing, BigQuery Streaming',
            difficulty: 'HARD',
            outcome: 'GCP Dataflow pipeline processing live streaming sensor data.'
          }
        ]
      }
    }
  });

  // 3. Data Science & Machine Learning with Gen AI
  const dsCourse = await prisma.course.create({
    data: {
      title: 'Data Science & Machine Learning with Gen AI',
      slug: 'data-science-ml-gen-ai',
      description: 'Build predictive models, LLM applications, and intelligent systems. Cover classical machine learning, Deep Learning via PyTorch, NLP, RAG architecture, and Multi-Agent structures.',
      duration: '40 Weeks',
      price: 25999,
      priceOriginal: 44999,
      mode: 'Live',
      published: true,
      features: {
        create: [
          { text: 'Deep Learning & PyTorch Implementations', icon: 'Flame' },
          { text: 'Advanced RAG & Hybrid Vector Searches', icon: 'Search' },
          { text: 'Multi-Agent workflows & planning', icon: 'Network' },
          { text: 'Full MLOps deployment pipelines via Docker', icon: 'Container' }
        ]
      },
      prerequisites: {
        create: [
          { text: 'Intermediate math (Linear Algebra and Calculus basics)' },
          { text: 'Python programming fundamentals' }
        ]
      },
      outcomes: {
        create: [
          { text: 'Implement classical regression, classification, and boosting models from scratch' },
          { text: 'Train and optimize Neural Networks using PyTorch' },
          { text: 'Build production-ready Retrieval Augmented Generation (RAG) models' },
          { text: 'Deploy predictive and generative pipelines using Docker and FastAPI' }
        ]
      },
      faqs: {
        create: [
          { question: 'What is the math load?', answer: 'We cover essential Linear Algebra, Probability, and Calculus in the first few weeks, ensuring you understand ML optimizations.' },
          { question: 'Will I learn PyTorch?', answer: 'Yes, PyTorch is our primary library for Deep Learning, Transformers, and Natural Language Processing.' }
        ]
      },
      projects: {
        create: [
          {
            title: 'Customer Churn Prediction Model',
            problemStatement: 'Train and evaluate multiple models to predict high-risk accounts using customer metrics.',
            technologies: 'Python, Scikit-Learn, XGBoost',
            skillsCovered: 'EDA, Feature Engineering, Classification Metrics',
            difficulty: 'MEDIUM',
            outcome: 'XGBoost model deployed with 88% recall for churn detection.'
          },
          {
            title: 'Advanced RAG Search Interface',
            problemStatement: 'Build a private documents explorer that parses PDFs, indexes them, and answers complex queries with context citations.',
            technologies: 'Python, PyTorch, Pinecone, LlamaIndex',
            skillsCovered: 'Embedding Generation, Chunking, Retrieval Reranking',
            difficulty: 'HARD',
            outcome: 'Knowledgebase application with verifiable citation sources.'
          },
          {
            title: 'Multi-Agent Research Assistant',
            problemStatement: 'Construct a system where agents collaborate to perform market research and generate PDF reports.',
            technologies: 'LangGraph, GPT-4, FastAPI, Docker',
            skillsCovered: 'Agent Orchestration, State Management, Tool Calling',
            difficulty: 'HARD',
            outcome: 'API service launching multiple agents executing specific search/write actions.'
          }
        ]
      }
    }
  });

  // 4. Software Development & AI Engineering
  const sdCourse = await prisma.course.create({
    data: {
      title: 'Software Development & AI Engineering',
      slug: 'software-development-ai-engineering',
      description: 'Build production software, AI applications, and autonomous agents. Combine DSA, Next.js Full Stack development, Microservices, and Devops with AI-assisted software engineering.',
      duration: '36 Weeks',
      price: 22999,
      priceOriginal: 39999,
      mode: 'Live',
      published: true,
      features: {
        create: [
          { text: 'Next.js 15 & NestJS Backend Systems', icon: 'Code' },
          { text: 'CI/CD Pipelines & Docker Deployments', icon: 'Terminal' },
          { text: 'Agentic Tool Calling & Model Context Protocol (MCP)', icon: 'Cpu' },
          { text: 'AI-assisted code reviews, security scans & delegation', icon: 'ShieldCheck' }
        ]
      },
      prerequisites: {
        create: [
          { text: 'Basic logical thinking and problem-solving concepts' },
          { text: 'No prior programming experience required' }
        ]
      },
      outcomes: {
        create: [
          { text: 'Develop and deploy full-stack web applications with React & Next.js' },
          { text: 'Design scalable, decoupled backend architectures using PostgreSQL & Redis' },
          { text: 'Implement agentic tool calling, planning, and memory in production apps' },
          { text: 'Collaborate with AI agents for verification, debugging, and testing workflows' }
        ]
      },
      faqs: {
        create: [
          { question: 'Is DSA covered?', answer: 'Yes, we dedicate the first 6 weeks to Data Structures and Algorithms in JavaScript/TypeScript and Python.' },
          { question: 'How is AI integrated into development?', answer: 'We explicitly teach you how to write specifications, manage contexts, debug with AI coding agents, and verify/test AI-generated code.' }
        ]
      },
      projects: {
        create: [
          {
            title: 'Full Stack SaaS Platform',
            problemStatement: 'Develop a subscription-based task manager with live dashboard updates and secure checkouts.',
            technologies: 'Next.js, Prisma, Tailwind, Stripe',
            skillsCovered: 'State Management, Server Components, Schema Design',
            difficulty: 'MEDIUM',
            outcome: 'Responsive task dashboard with subscription checkouts.'
          },
          {
            title: 'Multi-Tool Agent Hub',
            problemStatement: 'Construct a dashboard containing assistant chat interfaces that interface with databases and cloud services to execute jobs.',
            technologies: 'TypeScript, LangChain, MCP, Express',
            skillsCovered: 'Tool Calling, Context Engineering, Error Recovery',
            difficulty: 'HARD',
            outcome: 'Web platform allowing a user to run backend terminal operations via chat.'
          },
          {
            title: 'AI Code Evaluator & Reviewer',
            problemStatement: 'Build a CI/CD integration agent that pulls code changes, reviews syntax, formats code, and runs tests automatically.',
            technologies: 'GitHub Actions, Node.js, OpenAI API',
            skillsCovered: 'API Integration, Actions Orchestration, Security Reviews',
            difficulty: 'HARD',
            outcome: 'Action script executing automated reviews and tagging potential bugs in PRs.'
          }
        ]
      }
    }
  });

  console.log('Seeding curriculum modules and lessons...');

  // Data Analyst with Gen AI Modules & Lessons
  const daModules = [
    { title: 'Excel & Spreadsheet Analytics', order: 1, weeks: 'Weeks 1–2', lessons: ['Excel fundamentals & sorting', 'Formulas: XLOOKUP & INDEX/MATCH', 'Pivot tables & visualization', 'Power Query & AI tools'] },
    { title: 'SQL & Database Querying', order: 2, weeks: 'Weeks 3–6', lessons: ['Tables, keys & SELECT queries', 'JOINS & Subqueries', 'Common Table Expressions (CTEs)', 'Window functions & Optimization'] },
    { title: 'Python for Data Analysis', order: 3, weeks: 'Weeks 7–9', lessons: ['Python fundamentals', 'Pandas DataFrames', 'NumPy array calculations', 'Data cleaning & time-series'] },
    { title: 'Statistics for Analytics', order: 4, weeks: 'Weeks 10–11', lessons: ['Descriptive statistics & variance', 'Probability distributions', 'Hypothesis testing & t-tests', 'A/B testing workflows'] },
    { title: 'Power BI Dashboards', order: 5, weeks: 'Weeks 12–15', lessons: ['Data modeling & relations', 'DAX measures & calculated columns', 'Interactive visualization', 'Row-level security'] },
    { title: 'GenAI for Data Analysts', order: 6, weeks: 'Weeks 16–18', lessons: ['Generative AI fundamentals', 'Structured prompting & Text-to-SQL', 'AI-assisted Power BI & Python', 'Hallucination checks & security'] },
    { title: 'Advanced Analytics & Portfolio', order: 7, weeks: 'Weeks 19–21', lessons: ['Product & customer analytics', 'Cohort & RFM analytics', 'Forecasting methods', 'Portfolio project building'] },
    { title: 'Capstone & Career Preparation', order: 8, weeks: 'Weeks 22–24', lessons: ['End-to-End Business Capstone', 'SQL interview preparation', 'Mock interviews & Resume design'] }
  ];

  for (const m of daModules) {
    const mod = await prisma.module.create({
      data: {
        title: `${m.title} (${m.weeks})`,
        order: m.order,
        courseId: daCourse.id
      }
    });
    for (let i = 0; i < m.lessons.length; i++) {
      await prisma.courseLesson.create({
        data: {
          title: m.lessons[i],
          order: i + 1,
          moduleId: mod.id,
          description: `Master key concepts and practical exercises in ${m.lessons[i]}`
        }
      });
    }
  }

  // Data Engineer with Gen AI Modules & Lessons
  const deModules = [
    { title: 'Programming Foundations', order: 1, weeks: 'Weeks 1–3', lessons: ['Python fundamentals & OOP', 'Virtual environments & Git/GitHub', 'Linux command-line & Bash scripts'] },
    { title: 'SQL & Database Engineering', order: 2, weeks: 'Weeks 4–6', lessons: ['Advanced SQL optimization', 'Normalizations & Indexing strategies', 'PostgreSQL stored procedures & views'] },
    { title: 'Data Warehousing', order: 3, weeks: 'Weeks 7–9', lessons: ['ETL vs ELT frameworks', 'Star & Snowflake dimensional modeling', 'Google Cloud BigQuery warehouse layout'] },
    { title: 'ETL/ELT & Orchestration', order: 4, weeks: 'Weeks 10–13', lessons: ['ETL pipelines with API hooks', 'Apache Airflow installation & setup', 'Designing robust Airflow DAGs'] },
    { title: 'Big Data Processing', order: 5, weeks: 'Weeks 14–17', lessons: ['Distributed computing & Hadoop', 'Apache Spark architectures', 'PySpark transformations & Spark SQL'] },
    { title: 'Cloud Data Engineering (GCP)', order: 6, weeks: 'Weeks 18–21', lessons: ['GCP VPC networking & storage', 'Ingestion with Pub/Sub & Dataflow', 'Cloud Composer orchestrated streams'] },
    { title: 'Modern Data Stack', order: 7, weeks: 'Weeks 22–24', lessons: ['dbt pipelines & data lineage', 'Data contracts & governance rules', 'Lakehouse architectures'] },
    { title: 'GenAI for Data Engineers', order: 8, weeks: 'Weeks 25–27', lessons: ['Vector databases & text-to-SQL schemas', 'LLM-powered extraction agents', 'Model Context Protocol (MCP) data tools'] },
    { title: 'Capstone & Interview Preparation', order: 9, weeks: 'Weeks 28–32', lessons: ['Production Data Platform Capstone', 'System design interviews', 'Mock reviews & pipeline setups'] }
  ];

  const deBatchModules: any[] = [];
  for (const m of deModules) {
    const mod = await prisma.module.create({
      data: {
        title: `${m.title} (${m.weeks})`,
        order: m.order,
        courseId: deCourse.id
      }
    });
    deBatchModules.push(mod);
    for (let i = 0; i < m.lessons.length; i++) {
      await prisma.courseLesson.create({
        data: {
          title: m.lessons[i],
          order: i + 1,
          moduleId: mod.id,
          description: `Enterprise-grade practices and tasks in ${m.lessons[i]}`
        }
      });
    }
  }

  // Data Science & Machine Learning Modules & Lessons
  const dsModules = [
    { title: 'Python Foundations', order: 1, weeks: 'Weeks 1–3', lessons: ['Python structures & logic', 'NumPy array math & Pandas matrices', 'Git/GitHub codebase setups'] },
    { title: 'SQL for Data Science', order: 2, weeks: 'Weeks 4–6', lessons: ['Database schemas & JOIN engines', 'Subqueries & CTEs', 'Optimizing large analytical filters'] },
    { title: 'Statistics & Mathematics', order: 3, weeks: 'Weeks 7–10', lessons: ['Probability & distributions', 'Hypothesis testing & ANOVA', 'Linear algebra, vectors & calculus'] },
    { title: 'EDA & Visualizations', order: 4, weeks: 'Weeks 11–13', lessons: ['Data cleaning workflows', 'Seaborn & Plotly dashboards', 'Detecting anomalies & correlation'] },
    { title: 'Machine Learning Algorithms', order: 5, weeks: 'Weeks 14–19', lessons: ['Linear & Logistic regression', 'Decision trees & Random forests', 'Gradient boosting, XGBoost & hyperparameter tuning'] },
    { title: 'Unsupervised Learning', order: 6, weeks: 'Weeks 20–21', lessons: ['K-Means & DBSCAN clustering', 'Dimensionality reduction with PCA', 'Anomaly detection workflows'] },
    { title: 'Deep Learning with PyTorch', order: 7, weeks: 'Weeks 22–26', lessons: ['Backpropagation & optimizing weights', 'Neural nets in PyTorch', 'CNNs & transfer learning'] },
    { title: 'Natural Language Processing', order: 8, weeks: 'Weeks 27–28', lessons: ['Text preprocessing & word vectors', 'BERT & Sequence models', 'Attention & Transformers'] },
    { title: 'GenAI & LLM Engineering', order: 9, weeks: 'Weeks 29–33', lessons: ['LLM APIs & function calling', 'Vector databases & embeddings', 'Advanced RAG & retrieval tuning'] },
    { title: 'Agentic AI Systems', order: 10, weeks: 'Weeks 34–36', lessons: ['Agent design, tools & planning', 'Multi-agent frameworks & state', 'MCP & evaluating agents'] },
    { title: 'MLOps Deployment', order: 11, weeks: 'Weeks 37–38', lessons: ['FastAPI servers & Docker containers', 'Model registry & tracking (MLflow)', 'Continuous Integration/Deployment'] },
    { title: 'Capstone & Career Loops', order: 12, weeks: 'Weeks 39–40', lessons: ['AI/ML Capstone Production app', 'ML system design loops', 'DSA review & mocks'] }
  ];

  for (const m of dsModules) {
    const mod = await prisma.module.create({
      data: {
        title: `${m.title} (${m.weeks})`,
        order: m.order,
        courseId: dsCourse.id
      }
    });
    for (let i = 0; i < m.lessons.length; i++) {
      await prisma.courseLesson.create({
        data: {
          title: m.lessons[i],
          order: i + 1,
          moduleId: mod.id,
          description: `Advanced algorithmic training in ${m.lessons[i]}`
        }
      });
    }
  }

  // Software Development & AI Engineering Modules & Lessons
  const sdModules = [
    { title: 'Programming & DSA', order: 1, weeks: 'Weeks 1–6', lessons: ['TypeScript and Python core logic', 'Data structures (linked lists, stacks, trees)', 'Sorting, searching & recursion', 'Complexity analyses'] },
    { title: 'Web Development (React & Next.js)', order: 2, weeks: 'Weeks 7–11', lessons: ['HTML5 & CSS layouts', 'TypeScript DOM interactions', 'React framework & hooks', 'Next.js App router & server components'] },
    { title: 'Backend Engineering', order: 3, weeks: 'Weeks 12–15', lessons: ['Node.js & Express servers', 'REST API designs', 'PostgreSQL database relations & SQL', 'Caching structures via Redis'] },
    { title: 'Software Engineering Best Practices', order: 4, weeks: 'Weeks 16–18', lessons: ['Git workflows & testing frameworks', 'Clean code & SOLID structures', 'System designs & microservices'] },
    { title: 'DevOps & Cloud Systems', order: 5, weeks: 'Weeks 19–21', lessons: ['Linux scripting & Docker setups', 'CI/CD setups with GitHub Actions', 'Deployments on AWS/GCP'] },
    { title: 'Generative AI Engineering', order: 6, weeks: 'Weeks 22–26', lessons: ['LLM APIs & structured payloads', 'Embeddings & Pinecone vector indexing', 'RAG interfaces & routing'] },
    { title: 'AI Agents & Orchestration', order: 7, weeks: 'Weeks 27–30', lessons: ['Agent tooling, planning & memory', 'Multi-agent graphs & state control', 'MCP server connections'] },
    { title: 'AI-Assisted Software Engineering', order: 8, weeks: 'Weeks 31–33', lessons: ['Co-authoring code with AI assistants', 'AI code verification, debugging & tests', 'Evaluating context sizes & security'] },
    { title: 'Capstone & Career Preparation', order: 9, weeks: 'Weeks 34–36', lessons: ['Full AI SaaS Capstone', 'Full stack & system design mocks', 'Portfolio profiles on GitHub'] }
  ];

  for (const m of sdModules) {
    const mod = await prisma.module.create({
      data: {
        title: `${m.title} (${m.weeks})`,
        order: m.order,
        courseId: sdCourse.id
      }
    });
    for (let i = 0; i < m.lessons.length; i++) {
      await prisma.courseLesson.create({
        data: {
          title: m.lessons[i],
          order: i + 1,
          moduleId: mod.id,
          description: `Software engineering patterns in ${m.lessons[i]}`
        }
      });
    }
  }

  console.log('Creating batches for the 4 courses...');
  const coursesList = [daCourse, deCourse, dsCourse, sdCourse];
  const batches: any = {};
  for (const course of coursesList) {
    const batchName = `${course.title.replace(/[^a-zA-Z0-9 ]/g, '')} Batch Aug 2026`;
    batches[course.title] = await prisma.batch.create({
      data: {
        name: batchName,
        courseId: course.id,
      }
    });
  }

  // Create live classes for Aarav (Data Engineer course)
  console.log('Seeding live classes mapping...');
  const deBatch = batches[deCourse.title];
  const deMod1 = deBatchModules[0]; // Intro to GCP
  const deMod2 = deBatchModules[1]; // Advanced SQL

  const class1 = await prisma.class.create({
    data: {
      title: 'Google Cloud Global Infrastructure & Storage',
      description: 'Understanding GCP zones, Compute Engine virtual machines, and Cloud Storage buckets.',
      date: '2026-08-25',
      startTime: '19:00',
      endTime: '20:30',
      zoomLink: 'https://zoom.us/j/10000000001',
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      status: 'COMPLETED',
      instructorId: rahul.id,
      moduleId: deMod1.id,
      batchId: deBatch.id,
      preRead: JSON.stringify({
        objectives: ['Understand regions vs zones', 'Standard vs Coldline GCS storage classes', 'VM creation configurations'],
        resources: [
          { name: 'GCP Core Services Whitepaper', type: 'ARTICLE', url: 'https://cloud.google.com' }
        ]
      }),
      postRead: JSON.stringify({
        reading: 'Optimizing storage costs via object lifecycle management rules.',
        links: [{ name: 'GCS Lifecycles', url: 'https://cloud.google.com' }]
      })
    },
  });

  const class2 = await prisma.class.create({
    data: {
      title: 'BigQuery Core Fundamentals & Data Warehousing',
      description: 'Deep dive into BQ columnar storage, Dremel slots, and query costing models.',
      date: '2026-08-27',
      startTime: '19:00',
      endTime: '20:30',
      zoomLink: 'https://zoom.us/j/10000000002',
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      status: 'COMPLETED',
      instructorId: shivank.id,
      moduleId: deMod2.id,
      batchId: deBatch.id,
      preRead: JSON.stringify({
        objectives: ['OLAP vs OLTP', 'Columnar storage layout', 'Queries scanning costs estimation'],
        resources: [
          { name: 'BigQuery Cost Optimizer Guide', type: 'ARTICLE', url: 'https://cloud.google.com' }
        ]
      }),
      postRead: JSON.stringify({
        reading: 'Partitioning vs Clustering in BigQuery.',
        links: [{ name: 'BQ Table Optimizations', url: 'https://cloud.google.com' }]
      })
    },
  });

  console.log('Creating assignments...');

  const assignment = await prisma.assignment.create({
    data: {
      title: 'BigQuery Architecture & SQL Basics',
      description: 'Test your understanding of BigQuery query engines, columns, partitioning, and standard SQL queries.',
      classId: class2.id,
      difficulty: 'MEDIUM',
    },
  });

  const q1 = await prisma.question.create({
    data: {
      assignmentId: assignment.id,
      text: 'Which query strategy is best for reducing the amount of data scanned in a BigQuery table that contains a chronological log of events?',
      type: 'MCQ',
      options: JSON.stringify([
        'Adding more compute slots',
        'Partitioning the table by date',
        'Clustering the table by date',
        'Exporting the data to GCS'
      ]),
      correctAnswer: 'Partitioning the table by date',
      explanation: 'Partitioning physically splits the table by a date/time column so BQ scans only the relevant partitions instead of the whole table, lowering query cost.',
      points: 10,
    },
  });

  const q2 = await prisma.question.create({
    data: {
      assignmentId: assignment.id,
      text: 'BigQuery is based on which Google internal distributed database query engine?',
      type: 'MCQ',
      options: JSON.stringify(['Spanner', 'Bigtable', 'Dremel', 'Colossus']),
      correctAnswer: 'Dremel',
      explanation: 'Dremel is Google\'s query execution engine designed for read-only query structures, which forms the underlying analytical engine of BigQuery.',
      points: 10,
    },
  });

  console.log('Creating 20 students...');

  const studentData = [
    { name: 'Aarav Sharma', email: 'aarav@codedojo.com', courseTitle: deCourse.title },
    { name: 'Ananya Iyer', email: 'ananya@codedojo.com', courseTitle: deCourse.title },
    { name: 'Kabir Verma', email: 'kabir@codedojo.com', courseTitle: deCourse.title },
    { name: 'Diya Patel', email: 'diya@codedojo.com', courseTitle: deCourse.title },
    { name: 'Vihaan Rao', email: 'vihaan@codedojo.com', courseTitle: deCourse.title },

    { name: 'Rohan Joshi', email: 'rohan@codedojo.com', courseTitle: sdCourse.title },
    { name: 'Riya Gupta', email: 'riya@codedojo.com', courseTitle: sdCourse.title },
    { name: 'Dev Malhotra', email: 'dev@codedojo.com', courseTitle: sdCourse.title },
    { name: 'Meera Singh', email: 'meera@codedojo.com', courseTitle: sdCourse.title },
    { name: 'Priya Verma', email: 'priya@codedojo.com', courseTitle: sdCourse.title },

    { name: 'Arjun Sen', email: 'arjun@codedojo.com', courseTitle: dsCourse.title },
    { name: 'Sai Reddy', email: 'sai@codedojo.com', courseTitle: dsCourse.title },
    { name: 'Aditya Das', email: 'aditya@codedojo.com', courseTitle: dsCourse.title },
    { name: 'Kiara Nair', email: 'kiara@codedojo.com', courseTitle: dsCourse.title },
    { name: 'Kiara Sen', email: 'kiarasen@codedojo.com', courseTitle: dsCourse.title },

    { name: 'Sneha Shah', email: 'sneha@codedojo.com', courseTitle: daCourse.title },
    { name: 'Yash Deshmukh', email: 'yash@codedojo.com', courseTitle: daCourse.title },
    { name: 'Krishna Murthy', email: 'krishna@codedojo.com', courseTitle: daCourse.title },
    { name: 'Aaditya Bhat', email: 'aaditya@codedojo.com', courseTitle: daCourse.title },
    { name: 'Pranav Saxena', email: 'pranav@codedojo.com', courseTitle: daCourse.title },
  ];

  for (let i = 0; i < studentData.length; i++) {
    const s = studentData[i];
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        name: s.name,
        role: 'STUDENT',
        phone: `99000000${i.toString().padStart(2, '0')}`,
      },
    });

    const courseObj = coursesList.find(c => c.title === s.courseTitle)!;
    const batchObj = batches[s.courseTitle];

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        courseId: courseObj.id,
        batchId: batchObj ? batchObj.id : null,
        mentorId: i % 2 === 0 ? siddharth.id : neha.id,
      },
    });

    if (s.courseTitle === deCourse.title) {
      await prisma.attendance.create({
        data: {
          studentId: user.id,
          classId: class1.id,
          status: i % 5 === 0 ? 'ABSENT' : 'PRESENT',
          markedById: admin.id,
        },
      });

      await prisma.attendance.create({
        data: {
          studentId: user.id,
          classId: class2.id,
          status: 'PRESENT',
          markedById: admin.id,
        },
      });

      if (s.email === 'aarav@codedojo.com') {
        await prisma.submission.create({
          data: {
            studentId: user.id,
            questionId: q1.id,
            answer: 'Partitioning the table by date',
            isCorrect: true,
            score: 10,
            timeSpent: 45,
          },
        });
        await prisma.submission.create({
          data: {
            studentId: user.id,
            questionId: q2.id,
            answer: 'Dremel',
            isCorrect: true,
            score: 10,
            timeSpent: 30,
          },
        });
      }
    }
  }

  const aarav = await prisma.user.findUnique({ where: { email: 'aarav@codedojo.com' } });
  if (aarav) {
    console.log('Seeding student items for Aarav...');
    await prisma.mentorSession.create({
      data: {
        mentorId: siddharth.id,
        studentId: aarav.id,
        date: '2026-08-31',
        time: '18:00',
        topic: 'GCP BigQuery Partitioning & Clustering Mocks',
        zoomLink: 'https://zoom.us/j/98765432100',
        status: 'SCHEDULED',
      },
    });

    await prisma.mentorSession.create({
      data: {
        mentorId: siddharth.id,
        studentId: aarav.id,
        date: '2026-08-22',
        time: '17:00',
        topic: 'GCP VPC Networking and Cloud Subnets Intro',
        zoomLink: 'https://zoom.us/j/98765432100',
        status: 'COMPLETED',
        notes: 'Aarav designed a clean subnets structure.',
        feedback: 'Excellent work.',
        actionItems: '- Implement service account auth\n- Complete SQL review sets',
      },
    });

    const ticket = await prisma.supportTicket.create({
      data: {
        studentId: aarav.id,
        title: 'Queries regarding BigQuery Partition limits',
        description: 'How many partitions can we have per table in BigQuery?',
        category: 'Technical Issue',
        status: 'IN_PROGRESS',
      },
    });

    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: aarav.id,
        message: 'Hi, I need clarification on table partition limits. Thanks!',
      },
    });

    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: admin.id,
        message: 'Hello Aarav. In BigQuery, you can have up to 4,000 partitions per partitioned table.',
      },
    });

    await prisma.certificate.create({
      data: {
        studentId: aarav.id,
        courseId: deCourse.id,
        issuedDate: '2026-08-28',
        certificateId: 'DC-GCP-2026-00941',
      },
    });

    await prisma.achievement.create({
      data: {
        studentId: aarav.id,
        title: 'Perfect Attendance',
        description: 'Attended all live classes in Module 1.',
        icon: 'Award',
      },
    });

    await prisma.achievement.create({
      data: {
        studentId: aarav.id,
        title: 'BigQuery Expert',
        description: 'Scored 100% on the BigQuery architecture practice assignment.',
        icon: 'Zap',
      },
    });

    await prisma.notification.create({
      data: {
        userId: aarav.id,
        message: 'Your upcoming class "Data pipelines: Cloud Pub/Sub & Cloud Dataflow" starts in 2 days.',
        isRead: false,
      },
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
