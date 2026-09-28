import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for Ahmed Hamada Portfolio...");

  // 1. Create or update default Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ahmedhamada.dev";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Ahmed Hamada",
      passwordHash,
      role: "admin",
    },
    create: {
      email: adminEmail,
      name: "Ahmed Hamada",
      passwordHash,
      role: "admin",
    },
  });
  console.log(`Admin account ready: ${adminEmail}`);

  // 2. Create or update Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default_settings" },
    update: {},
    create: {
      id: "default_settings",
      siteName: "Ahmed Hamada Portfolio",
      siteTitleEn: "Ahmed Hamada | Data Analyst & BI Developer",
      siteTitleAr: "أحمد حمادة | محلل بيانات ومطور ذكاء الأعمال",
      logoText: "Ahmed Hamada",
      
      heroTitleEn: "Ahmed Hamada",
      heroTitleAr: "أحمد حمادة",
      heroHeadlineEn: "Turning Data into Insights and Insights into Decisions.",
      heroHeadlineAr: "تحويل البيانات إلى رؤى والرؤى إلى قرارات أعمال استراتيجية.",
      heroSubheadlineEn: "Data Analyst | BI Developer | Technical Instructor",
      heroSubheadlineAr: "محلل بيانات | مطور ذكاء الأعمال (BI) | مدرب تقني",
      heroDescEn: "I transform raw data into meaningful insights and interactive dashboards that support better business decisions.",
      heroDescAr: "أقوم بتحويل البيانات الأولية المعقدة إلى رؤى قيّمة ولوحات تحكم تفاعلية تدعم اتخاذ قرارات دقيقة للأعمال.",
      heroAvailable: true,
      availabilityTextEn: "Available for Projects & Consulting",
      availabilityTextAr: "متاح للمشاريع والخدمات الاستشارية والتدريب",
      
      aboutBioEn: "I am a passionate Data Analyst and Business Intelligence Developer with a solid academic foundation from the Faculty of Commerce, Kafr El Sheikh University. I combine business acumen with deep analytical techniques to build end-to-end data workflows, ETL processes, and executive Power BI dashboards that empower stakeholders to make informed decisions.",
      aboutBioAr: "محلل بيانات ومطور ذكاء أعمال، خريج كلية التجارة بجامعة كفر الشيخ. أجمع بين الرؤية التجارية والخبرة التقنية في بناء مسارات البيانات، وهندسة استعلامات ETL، وتصميم لوحات تحكم تنفيذية متقدمة عبر Power BI تدعم الإدارة في اتخاذ قرارات دقيقة.",
      aboutHighlightsEn: "• Graduate of Faculty of Commerce, Kafr El Sheikh University\n• Advanced expertise in Power BI, DAX & Power Query\n• Proficient in SQL query optimization and database modeling\n• Python data processing with Pandas & NumPy\n• Experienced Technical Instructor and Workshop Trainer",
      aboutHighlightsAr: "• خريج كلية التجارة - جامعة كفر الشيخ\n• خبرة متقدمة في Power BI و DAX و Power Query\n• مهارة عالية في لغة SQL وبناء نماذج البيانات\n• معالجة وتحليل البيانات بلغة Python عبر Pandas و NumPy\n• مدرب تقني ومقدم ورش عمل تخصصية",

      primaryColor: "#0B2D5B",
      royalColor: "#2563EB",
      lightColor: "#60A5FA",
      darkColor: "#0F172A",
      grayColor: "#E5E7EB",

      contactEmail: "ahmed.hamada@example.com",
      contactPhone: "+20 100 000 0000",
      whatsapp: "+20 100 000 0000",
      linkedinUrl: "https://linkedin.com/in/ahmed-hamada",
      githubUrl: "https://github.com/ahmed-hamada",
      kaggleUrl: "https://kaggle.com/ahmedhamada",
      locationEn: "Egypt",
      locationAr: "مصر",
      
      footerTextEn: "© 2026 Ahmed Hamada. All rights reserved. Data Analyst & BI Developer.",
      footerTextAr: "© 2026 أحمد حمادة. جميع الحقوق محفوظة. محلل بيانات ومطور ذكاء الأعمال.",
    },
  });
  console.log("Site settings seeded.");

  // 3. Categories
  const categories = [
    { nameEn: "Business Intelligence", nameAr: "ذكاء الأعمال", slug: "business-intelligence", order: 1 },
    { nameEn: "Data Analysis", nameAr: "تحليل البيانات", slug: "data-analysis", order: 2 },
    { nameEn: "Data Modeling & ETL", nameAr: "نمذجة البيانات و ETL", slug: "data-modeling-etl", order: 3 },
    { nameEn: "Python Analytics", nameAr: "تحليلات بايثون", slug: "python-analytics", order: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 4. Skills
  const skillsData = [
    { nameEn: "Power BI", nameAr: "باور بي آي (Power BI)", categoryName: "Business Intelligence", iconName: "BarChart3", proficiency: 95, order: 1 },
    { nameEn: "SQL", nameAr: "إس كيو إل (SQL)", categoryName: "Data Analysis", iconName: "Database", proficiency: 90, order: 2 },
    { nameEn: "Python", nameAr: "بايثون (Python)", categoryName: "Python Analytics", iconName: "Code2", proficiency: 85, order: 3 },
    { nameEn: "Excel & Advanced Formulas", nameAr: "إكسيل متقدم", categoryName: "Business Intelligence", iconName: "Sheet", proficiency: 95, order: 4 },
    { nameEn: "DAX (Data Analysis Expressions)", nameAr: "صيغ DAX التحليلية", categoryName: "Business Intelligence", iconName: "Sigma", proficiency: 90, order: 5 },
    { nameEn: "Power Query (M Language)", nameAr: "باور كويري (Power Query)", categoryName: "Data Modeling & ETL", iconName: "Workflow", proficiency: 92, order: 6 },
    { nameEn: "Pandas & NumPy", nameAr: "مكتبات Pandas و NumPy", categoryName: "Python Analytics", iconName: "Binary", proficiency: 88, order: 7 },
    { nameEn: "Data Modeling & Star Schema", nameAr: "نمذجة البيانات (Star Schema)", categoryName: "Data Modeling & ETL", iconName: "Network", proficiency: 90, order: 8 },
    { nameEn: "ETL Processes & Data Cleaning", nameAr: "تنقية وهندسة البيانات (ETL)", categoryName: "Data Modeling & ETL", iconName: "Filter", proficiency: 92, order: 9 },
    { nameEn: "Exploratory Data Analysis (EDA)", nameAr: "التحليل الاستكشافي للبيانات", categoryName: "Data Analysis", iconName: "Search", proficiency: 90, order: 10 },
  ];

  await prisma.skill.deleteMany();
  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }

  // 5. Services
  const servicesData = [
    {
      titleEn: "Business Intelligence & Power BI Dashboards",
      titleAr: "تطوير لوحات تحكم ذكاء الأعمال (Power BI)",
      descriptionEn: "Designing end-to-end interactive Power BI dashboards with robust DAX calculations, custom drill-downs, and executive KPI tracking.",
      descriptionAr: "تصميم وتطوير لوحات تحكم تفاعلية متكاملة عبر Power BI باستخدام معادلات DAX متقدمة لتتبع مؤشرات الأداء الرئيسية ودعم الإدارة.",
      iconName: "BarChart3",
      order: 1,
    },
    {
      titleEn: "Data Analysis & Business Problem Solving",
      titleAr: "تحليل البيانات وحل مشكلات الأعمال",
      descriptionEn: "Transforming complex operational and financial datasets into actionable business intelligence through rigorous statistical and exploratory analysis.",
      descriptionAr: "تحويل البيانات المالية والتشغيلية المعقدة إلى رؤى قابلة للتطبيق من خلال التحليل الإحصائي والاستكشافي المتقدم.",
      iconName: "LineChart",
      order: 2,
    },
    {
      titleEn: "ETL Pipelines & Data Cleaning",
      titleAr: "تنقية البيانات وبناء مسارات ETL",
      descriptionEn: "Automating data extraction, transformation, and loading using Power Query, SQL, and Python to ensure clean, reliable data pipelines.",
      descriptionAr: "أتمتة استخراج وتحويل وتحميل البيانات باستخدام Power Query و SQL و Python لضمان جودة ودقة البيانات في التقارير.",
      iconName: "Filter",
      order: 3,
    },
    {
      titleEn: "Excel Reporting & Automation",
      titleAr: "تقارير إكسيل المتقدمة والأتمتة",
      descriptionEn: "Building advanced spreadsheet models, automated financial summaries, and dynamic dashboard reports with Power Pivot and macros.",
      descriptionAr: "بناء نماذج جداول بيانات مالية وتشغيلية متقدمة، وأتمتة التقارير الدورية باستخدام Power Pivot والصيغ المتقدمة.",
      iconName: "Sheet",
      order: 4,
    },
    {
      titleEn: "Technical Training & Workshops",
      titleAr: "التدريب التقني وورش العمل المتخصصة",
      descriptionEn: "Delivering practical hands-on training sessions in Data Analysis, Power BI, SQL, and Excel for students, professionals, and corporate teams.",
      descriptionAr: "تقديم دورات وورش عمل عملية وتطبيقية في تحليل البيانات و Power BI و SQL و Excel للطلاب والمهنيين وفرق العمل.",
      iconName: "GraduationCap",
      order: 5,
    },
  ];

  await prisma.service.deleteMany();
  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }

  // 6. Projects
  const projectsData = [
    {
      slug: "retail-sales-executive-powerbi-dashboard",
      titleEn: "Retail Sales Performance & Executive BI Dashboard",
      titleAr: "لوحة تحكم تنفيذية لأداء مبيعات التجزئة (Power BI)",
      shortDescEn: "An end-to-end interactive Power BI dashboard analyzing multi-store retail sales, customer demographics, and margin profitability.",
      shortDescAr: "لوحة تحكم تفاعلية متكاملة عبر Power BI لتحليل مبيعات التجزئة متعددة الفروع وهوامش الربحية وسلوك العملاء.",
      overviewEn: "This case study focuses on building a unified Business Intelligence solution for a multi-regional retail chain. The goal was to eliminate fragmented spreadsheet reports and provide leadership with real-time visibility into revenue streams, regional sales growth, discount impact, and inventory turnover.",
      overviewAr: "تركز دراسة الحالة هذه على بناء حل ذكاء أعمال موحد لسلسلة متاجر تجزئة متعددة الفروع، بهدف القضاء على التقارير اليدوية المشتتة وتزويد الإدارة برؤية فورية للإيرادات ونمو المبيعات الإقليمية وهوامش الربح.",
      businessProblemEn: "The retail management faced delayed reporting cycles (up to 10 days post-month end), inconsistent KPI calculations across regional branches, and lack of visibility into margin erosion caused by aggressive promotional discounting.",
      businessProblemAr: "واجهت الإدارة تأخراً كبيراً في استخراج التقارير الشهرية، وعدم اتساق في حساب مؤشرات الأداء بين الفروع، وغياب الرؤية الواضحة لتأثير الخصومات الترويجية على تآكل هوامش الربح.",
      objectivesEn: "• Develop a central Star Schema data model integrating 3 years of sales transactions.\n• Build DAX measures for Year-over-Year (YoY) growth, Running Total, and Dynamic Profit Margin.\n• Create intuitive executive filters for Region, Product Category, and Store Tier.",
      objectivesAr: "• تطوير نموذج بيانات Star Schema يدمج معاملات المبيعات لـ 3 سنوات.\n• بناء مقاييس DAX لحساب النمو السنوي (YoY) وهوامش الربح الديناميكية.\n• توفير عوامل تصفية تفاعلية حسب المنطقة وفئات المنتجات وفئات الفروع.",
      datasetDescEn: "Transactional dataset comprising 250,000+ sales records, customer profiles, product hierarchy, and regional target benchmarks.",
      datasetDescAr: "مجموعة بيانات معاملات تضم أكثر من 250 ألف سجل مبيعات، وبيانات العملاء، وتصنيف المنتجات ومستهدفات الفروع.",
      dataSourceEn: "Enterprise SQL Database & POS Records",
      dataSourceAr: "قاعدة بيانات المؤسسة وسجلات نقاط البيع (POS)",
      toolsAndTech: "Power BI, DAX, Power Query, SQL Server, Star Schema Modeling",
      methodologyEn: "1. Data Extraction & Cleaning in Power Query (M Language).\n2. Star Schema modeling with explicit Fact and Dimension tables.\n3. Advanced DAX time-intelligence and KPI measures.\n4. UX/UI dashboard layout design using strict color hierarchy.",
      methodologyAr: "1. استخراج وتنقية البيانات عبر Power Query.\n2. نمذجة البيانات بهيكل Star Schema وفصل جداول الحقائق والأبعاد.\n3. برمجة مقاييس DAX الذكية للتحليل الزمني والمؤشرات الرئيسية.\n4. تصميم واجهة لوحة التحكم بتسلسل بصري منظم وتجربة مستخدم مريحة.",
      keyFindingsEn: "• 22% of product SKUs contributed to 78% of gross profit.\n• Heavy discounting during Q3 failed to increase net profit despite a 14% surge in transaction volume.\n• Two regional zones consistently beat revenue targets by over 18%.",
      keyFindingsAr: "• 22% فقط من المنتجات تحقق 78% من إجمالي الأرباح.\n• الخصومات الكبيرة في الربع الثالث لم ترفع صافي الربح رغم زيادة حجم المعاملات بنسبة 14%.\n• منطقتان جغرافيتان حققتا نمواً تجاوز المستهدف بنسبة 18%.",
      recommendationsEn: "• Restructure promotional campaigns to focus on high-margin bundle offers.\n• Reallocate marketing spend toward top-performing regional zones.\n• Implement automated weekly refresh triggers to keep branch managers updated.",
      recommendationsAr: "• إعادة هيكلة العروض الترويجية والتركيز على باقات المنتجات عالية الهامش الربحي.\n• إعادة توجيه الميزانيات التسويقية نحو المناطق الجغرافية الأكثر كفاءة.\n• تطبيق التحديث الآلي الأسبوعي لبيانات الفروع لدعم اتخاذ القرارات السريعة.",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      secondaryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=80"
      ]),
      tags: "Power BI, DAX, SQL, Data Modeling, Star Schema, Business Intelligence",
      categoryName: "Business Intelligence",
      githubUrl: "https://github.com/ahmed-hamada",
      liveDemoUrl: "https://app.powerbi.com",
      isFeatured: true,
      isPublished: true,
      order: 1,
    },
    {
      slug: "customer-churn-prediction-python-analysis",
      titleEn: "Customer Churn Analysis & Risk Scoring in Python",
      titleAr: "تحليل وتوقع تسرب العملاء باستخدام بايثون (Python)",
      shortDescEn: "Exploratory data analysis and predictive segmentation in Python to identify customer attrition drivers and calculate churn risk.",
      shortDescAr: "تحليل استكشافي ونمذجة تنبؤية باستخدام بايثون لتحديد العوامل المؤدية لتسرب العملاء وقياس درجات المخاطر.",
      overviewEn: "This project analyzes telecom customer behavioral patterns to identify the early warning indicators of churn. Using Python, Pandas, and visualization libraries, we performed exploratory data analysis (EDA), correlation studies, and customer tenure segmentation.",
      overviewAr: "يهدف هذا المشروع إلى دراسة أنماط سلوك العملاء في قطاع الاتصالات لتحديد المؤشرات المبكرة للتسرب، باستخدام بايثون ومكتبات Pandas والتحليل الاستكشافي للبيانات.",
      businessProblemEn: "The business was experiencing an annual customer churn rate of 26%, directly hurting recurring revenue and increasing customer acquisition costs.",
      businessProblemAr: "عانت الشركة من معدل تسرب عملاء بلغ 26% سنوياً، مما أثر سلباً على الإيرادات المتكررة ورفع تكلفة اكتساب العملاء الجدد.",
      objectivesEn: "• Perform data cleaning, missing value imputation, and feature engineering.\n• Discover correlations between contract types, monthly charges, and churn probability.\n• Produce clear visualization reports with actionable retention strategies.",
      objectivesAr: "• تنقية البيانات وهندسة المتغيرات ذات الدلالة الإحصائية.\n• كشف الارتباط بين نوع العقد وقيمة الفاتورة الشهرية ومعدل التسرب.\n• تقديم تقارير بصرية واضحة مدعومة بتوصيات دقيقة للحفاظ على العملاء.",
      datasetDescEn: "Telco customer database with 7,043 customer records across 21 demographic and service usage attributes.",
      datasetDescAr: "قاعدة بيانات تشمل 7,043 عميلاً مع 21 خاصية ديموغرافية وخدمية.",
      dataSourceEn: "Telco Operations Database",
      dataSourceAr: "قاعدة بيانات عمليات قطاع الاتصالات",
      toolsAndTech: "Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebooks",
      methodologyEn: "1. Data preparation and type validation.\n2. Univariate and bivariate analysis of customer tenure and payment methods.\n3. Correlation matrix analysis and feature importance ranking.\n4. Generation of customer risk scoring segments.",
      methodologyAr: "1. تجهيز البيانات والتحقق من صحة الأنواع.\n2. التحليل الإحصائي أحادي وثنائي المتغيرات لمدة الاشتراك وطريقة الدفع.\n3. تحليل مصفوفة الارتباط وتحديد أهم الخصائص المؤثرة.\n4. تصنيف شرائح العملاء بحسب مستوى خطورة التسرب.",
      keyFindingsEn: "• Month-to-month contract holders exhibited a 42% churn rate compared to only 3% for two-year contracts.\n• Electronic check payment users were 2.5x more likely to churn than automated credit card users.\n• Fiber optic customers with no tech support experienced the highest friction.",
      keyFindingsAr: "• أصحاب العقود الشهرية سجلوا نسبة تسرب 42% مقارنة بـ 3% فقط لأصحاب عقود السنتين.\n• مستخدمو الدفع اليدوي سجلوا احتمالية تسرب أعلى بمقدار 2.5 مرة.\n• عملاء الألياف الضوئية بدون دعم فني كانوا الأكثر عرضة لمغادرة الخدمة.",
      recommendationsEn: "• Incentivize migration from month-to-month contracts to annual commitments.\n• Offer complimentary tech support onboarding for new fiber optic subscriptions.\n• Set up proactive customer care outreach for high-risk accounts.",
      recommendationsAr: "• تقديم حوافز للانتقال من العقود الشهرية إلى العقود السنوية.\n• توفير خدمة دعم فني مجانية عند تفعيل الاشتراكات الجديدة.\n• إطلاق حملات تواصل استباقية مع العملاء المصنفين في الفئة عالية الخطورة.",
      coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
      secondaryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80"
      ]),
      tags: "Python, Pandas, NumPy, Data Analysis, Seaborn, EDA",
      categoryName: "Python Analytics",
      githubUrl: "https://github.com/ahmed-hamada",
      isFeatured: true,
      isPublished: true,
      order: 2,
    },
    {
      slug: "supply-chain-logistics-optimization",
      titleEn: "Supply Chain & Logistics KPI Analysis",
      titleAr: "تحليل مؤشرات أداء سلاسل الإمداد والخدمات اللوجستية",
      shortDescEn: "Comprehensive analytics model evaluating shipping lead times, carrier on-time delivery rates, and warehouse inventory turnover.",
      shortDescAr: "نموذج تحليلي شامل لتقييم مدد الشحن ونسب الالتزام بمواعيد التوصيل ومعدل دوران المخزون بالمستودعات.",
      overviewEn: "This project provides an in-depth analytics framework for logistics operations, measuring vendor lead times, route bottlenecks, and carrier SLA compliance across global distribution hubs.",
      overviewAr: "يقدم هذا المشروع إطاراً تحليلياً متقدماً للعمليات اللوجستية، لقياس فترات التوريد، واختناقات خطوط الشحن، ومدى التزام شركات النقل باتفاقيات مستوى الخدمة.",
      businessProblemEn: "Frequent delivery delays resulted in supply chain bottlenecks and elevated penalty costs from corporate clients.",
      businessProblemAr: "تسببت التأخيرات المتكررة في الشحن في حدوث اختناقات في التوريد وغرامات تأخير من العملاء التجاريين.",
      objectivesEn: "• Measure average lead times by carrier and transport mode.\n• Identify regional distribution routes with high defect rates.\n• Design automated Power BI alerts for shipment delays.",
      objectivesAr: "• قياس متوسط زمن التوريد لكل ناقل ونوع شحن.\n• تحديد خطوط التوزيع ذات معدلات التأخير المرتفعة.\n• تصميم تنبيهات آلية لتنبيه مدراء العمليات عند تجاوز الحدود المسموحة.",
      datasetDescEn: "Over 180,000 shipment dispatch records across 4 international logistics hubs.",
      datasetDescAr: "أكثر من 180 ألف سجل شحنة عبر 4 مراكز لوجستية رئيسية.",
      dataSourceEn: "Logistics ERP System",
      dataSourceAr: "نظام ERP اللوجستي للمؤسسة",
      toolsAndTech: "SQL, Power BI, Advanced Excel, Power Query, Data Modeling",
      methodologyEn: "1. Data extraction from multiple ERP tables using SQL views.\n2. Normalization and transformation in Power Query.\n3. KPI design for On-Time-In-Full (OTIF) delivery metrics.\n4. Route performance scorecard development.",
      methodologyAr: "1. استخراج البيانات من جداول ERP عبر SQL.\n2. توحيد ومعالجة البيانات في Power Query.\n3. بناء مؤشر الالتزام بالتوصيل في الموعد وبالمواصفات (OTIF).\n4. تصميم لوحة تقييم أداء مسارات الشحن والناقلين.",
      keyFindingsEn: "• Ground shipping on corridor B experienced a 34% higher delay rate due to customs clearance bottlenecks.\n• Top 2 carriers maintained a 96% OTIF delivery rate while the third carrier fell below 74%.",
      keyFindingsAr: "• مسار الشحن البري B سجل تأخيراً أعلى بنسبة 34% بسبب إجراءات التخليص الجمركي.\n• أفضل شركتي نقل حافظتا على نسبة التزام 96% بينما انخفض الناقل الثالث إلى أقل من 74%.",
      recommendationsEn: "• Renegotiate SLAs with underperforming logistics carriers.\n• Establish buffer stock in regional distribution centers for critical SKUs.",
      recommendationsAr: "• إعادة التفاوض بشأن شروط مستوى الخدمة مع شركات النقل ذات الأداء المنخفض.\n• توفير مخزون أمان إضافي في المراكز الإقليمية للأصناف الحيوية.",
      coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      secondaryImages: JSON.stringify([]),
      tags: "SQL, Power BI, Supply Chain, Logistics, ETL, Power Query",
      categoryName: "Data Modeling & ETL",
      githubUrl: "https://github.com/ahmed-hamada",
      isFeatured: false,
      isPublished: true,
      order: 3,
    },
  ];

  await prisma.project.deleteMany();
  for (const proj of projectsData) {
    await prisma.project.create({ data: proj });
  }

  // 7. Experience
  const experienceData = [
    {
      organizationEn: "Freelance & Consulting",
      organizationAr: "مستشار ومحلل بيانات مستقل",
      positionEn: "Data Analyst & BI Developer",
      positionAr: "محلل بيانات ومطور ذكاء الأعمال",
      type: "work",
      descriptionEn: "Delivering custom Business Intelligence solutions, interactive Power BI executive dashboards, automated financial models, and data pipeline ETL engineering for diverse business clients.",
      descriptionAr: "تقديم حلول ذكاء الأعمال المخصصة، وتصميم لوحات تحكم Power BI تفاعلية، وبناء نماذج مالية مؤتمتة وهندسة مسارات البيانات (ETL) لعملاء الأعمال.",
      startDate: "2023",
      endDate: null,
      isCurrent: true,
      locationEn: "Egypt",
      locationAr: "مصر",
      order: 1,
    },
    {
      organizationEn: "Technical Training & Workshops",
      organizationAr: "التدريب التقني وورش العمل",
      positionEn: "Data Analytics & Power BI Instructor",
      positionAr: "مدرب تحليل البيانات و Power BI",
      type: "training",
      descriptionEn: "Conducted intensive hands-on workshops covering Excel Advanced Formulas, Power Query, SQL Database Querying, Power BI Data Modeling, and DAX for students and early-career analysts.",
      descriptionAr: "تقديم ورش عمل تدريبية مكثفة تغطي صيغ Excel المتقدمة، و Power Query، ولغة SQL، ونمذجة بيانات Power BI، وصيغ DAX التحليلية للطلاب والمهتمين بالمجال.",
      startDate: "2023",
      endDate: null,
      isCurrent: true,
      locationEn: "Egypt",
      locationAr: "مصر",
      order: 2,
    },
  ];

  await prisma.experience.deleteMany();
  for (const exp of experienceData) {
    await prisma.experience.create({ data: exp });
  }

  // 8. Education
  const educationData = [
    {
      institutionEn: "Faculty of Commerce, Kafr El Sheikh University",
      institutionAr: "كلية التجارة - جامعة كفر الشيخ",
      degreeEn: "Bachelor's Degree in Commerce",
      degreeAr: "بكالوريوس في التجارة",
      fieldEn: "Accounting & Business Administration",
      fieldAr: "المحاسبة وإدارة الأعمال",
      startDate: "2019",
      endDate: "2023",
      gradeEn: "Good",
      gradeAr: "جيد",
      descriptionEn: "Focused on financial accounting, statistics, business decision modeling, and quantitative analysis.",
      descriptionAr: "دراسة متخصصة في المحاسبة المالية والإحصاء وبناء النماذج المالية والتحليل الكمي للأعمال.",
      order: 1,
    },
  ];

  await prisma.education.deleteMany();
  for (const edu of educationData) {
    await prisma.education.create({ data: edu });
  }

  // 9. Certificates
  const certificatesData = [
    {
      titleEn: "Microsoft Certified: Power BI Data Analyst Associate",
      titleAr: "شهادة محلل بيانات Power BI معتمد من مايكروسوفت",
      issuerEn: "Microsoft",
      issuerAr: "مايكروسوفت",
      issueDate: "2024",
      credentialId: "PL-300-COMPLETED",
      verificationUrl: "https://learn.microsoft.com",
      descriptionEn: "Demonstrating end-to-end expertise in Power BI data ingestion, modeling, DAX measures, report design, and workspace management.",
      descriptionAr: "إثبات الخبرة المتكاملة في استيراد ونمذجة البيانات وتطوير مقاييس DAX وتصميم التقارير وإدارتها عبر Power BI.",
      skills: "Power BI, DAX, Power Query, Data Modeling",
      isFeatured: true,
      order: 1,
    },
    {
      titleEn: "Advanced SQL for Data Analytics & Engineering",
      titleAr: "لغة SQL المتقدمة لتحليل وهندسة البيانات",
      issuerEn: "Professional Analytics Institute",
      issuerAr: "المعهد التخصصي لتحليل البيانات",
      issueDate: "2023",
      credentialId: "SQL-ADV-9821",
      verificationUrl: "https://example.com/verify",
      descriptionEn: "Comprehensive mastery of window functions, subqueries, CTEs, stored procedures, indexing, and query performance tuning.",
      descriptionAr: "إتقان دوال النوافذ (Window Functions) والاستعلامات الفرعية و CTEs وإجراءات الفهرسة وتحسين أداء الاستعلامات.",
      skills: "SQL, Query Optimization, Database Design",
      isFeatured: true,
      order: 2,
    },
    {
      titleEn: "Python for Data Analysis & Visualization Specialist",
      titleAr: "بايثون لتحليل وعرض البيانات",
      issuerEn: "Data Science Academy",
      issuerAr: "أكاديمية علوم البيانات",
      issueDate: "2023",
      credentialId: "PY-DATA-5542",
      verificationUrl: "https://example.com/verify",
      descriptionEn: "Hands-on certification in Python, Pandas, NumPy, Matplotlib, and exploratory data analysis methodologies.",
      descriptionAr: "شهادة تطبيقية في لغة بايثون ومكتبات Pandas و NumPy و Matplotlib ومنهجيات التحليل الاستكشافي للبيانات.",
      skills: "Python, Pandas, NumPy, Matplotlib",
      isFeatured: true,
      order: 3,
    },
  ];

  await prisma.certificate.deleteMany();
  for (const cert of certificatesData) {
    await prisma.certificate.create({ data: cert });
  }

  // 10. Navigation Items
  const navItems = [
    { labelEn: "Home", labelAr: "الرئيسية", href: "#home", order: 1 },
    { labelEn: "About", labelAr: "عني", href: "#about", order: 2 },
    { labelEn: "Skills", labelAr: "المهارات", href: "#skills", order: 3 },
    { labelEn: "Services", labelAr: "الخدمات", href: "#services", order: 4 },
    { labelEn: "Projects", labelAr: "المشاريع", href: "#projects", order: 5 },
    { labelEn: "Experience", labelAr: "الخبرات", href: "#experience", order: 6 },
    { labelEn: "Certificates", labelAr: "الشهادات", href: "#certificates", order: 7 },
    { labelEn: "Contact", labelAr: "تواصل معي", href: "#contact", order: 8 },
  ];

  await prisma.navigationItem.deleteMany();
  for (const nav of navItems) {
    await prisma.navigationItem.create({ data: nav });
  }

  console.log("Database seeded successfully with Ahmed Hamada's verified profile data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
