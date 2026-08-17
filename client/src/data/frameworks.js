export const FRAMEWORKS = [
  {
    id: 'opener',
    icon: '☎',
    color: 'var(--purple)',
    tag: 'Opening',
    title: 'Call opener',
    desc: 'Persona-based cold call openers',
    count: 6,
    tabs: [
      {
        label: 'Head of IT',
        description: 'Cares about: strategy, scalability, security posture, cost control.',
        items: [
          'We help Heads of IT simplify endpoint strategy, strengthen security posture, and scale operations without adding tools. How is your endpoint visibility today?',
          'Which devices or user groups are the hardest to secure or manage right now?',
          'How many different tools are currently involved in endpoint management, and how do you coordinate between them?',
          'If your device count doubled, which areas of endpoint management would become most challenging?',
          'Positioning: Gartner® Magic Quadrant™ Leader 2026 – Endpoint Management Tools'
        ]
      },
      {
        label: 'IT Manager',
        description: 'Cares about: standardisation, outcomes, risk reduction, team efficiency.',
        items: [
          'We work with IT managers to simplify endpoint operations, reduce tool sprawl, and improve security across the organisation. How are you managing endpoints today?',
          'How many different tools are you currently using to manage and secure endpoints?',
          'Which endpoint-related tasks take up the most time for your team on a weekly basis?',
          'How do you get real-time visibility into the security status of all endpoints today?',
          'When something goes wrong on an endpoint, how easy is it for your team to investigate and respond?'
        ]
      },
      {
        label: 'Service Desk',
        description: 'Cares about: ticket volume, SLA adherence, team productivity, user experience.',
        items: [
          'We work with Service Desk managers to reduce ticket volumes, speed up resolution times, and give their teams better endpoint visibility. How is your service desk handling endpoint-related tickets today?',
          'Which types of endpoint issues generate the highest volume of tickets for your team?',
          'How often do you see the same issues coming back from the same devices or users?',
          'How often is your team able to fully resolve endpoint issues on the first interaction?',
          'What typically prevents tickets from being resolved at first contact?'
        ]
      },
      {
        label: 'SysAdmin',
        description: 'Cares about: control, automation, reliability, fewer manual tasks.',
        items: [
          'We help system administrators centrally manage, patch, and secure all endpoints without adding complexity. What tools are you using for endpoint management today?',
          'How do you currently confirm that patches have been successfully applied across all devices?',
          'Which endpoint tasks are still handled manually that you wish were automated?',
          'What processes require the most ongoing intervention from your team?',
          'How do you decide which alerts actually need immediate attention?'
        ]
      },
      {
        label: 'C-Level',
        description: 'Cares about: risk mitigation, security posture, attack surface, alert fatigue.',
        items: [
          'We help C-Level executives reduce risk by automating baseline security processes and providing 360° visibility into the IT portfolio. How are you automating device patching and compliance reporting today?',
          'How are you automating patching and device inventories?',
          'Are you monitoring endpoint configuration changes for compliance?',
          'How many tools make up your IT management stack?',
          'How are you demonstrating continuous vulnerability management to auditors?'
        ]
      },
      {
        label: 'Technician',
        description: 'Cares about: speed, ease of use, day-to-day pain points, less manual work.',
        items: [
          'We help IT teams simplify everyday tasks like patching, remote access, and monitoring — so you can focus on higher-value work. What does your current endpoint management setup look like?',
          'Which endpoint tasks still require the most manual effort from your team?',
          'Where does your ticket backlog tend to build up the most?',
          'What makes supporting users remotely more difficult than it should be?',
          'How much time do you spend on patching and maintenance that could be automated?'
        ]
      }
    ]
  },
  {
    id: 'spin',
    icon: '☰',
    color: 'var(--acc)',
    tag: 'Discovery',
    title: 'SPIN framework',
    desc: 'Situation → Problem → Implication → Need-payoff',
    count: 4,
    tabs: [
      {
        label: 'Situation (S)',
        description: 'Understand the current landscape before probing for problems.',
        items: [
          '"What tools are you currently using to manage and secure endpoints?"',
          '"How many endpoints are you managing today?"',
          '"How many different tools are involved in endpoint management?"',
          '"What does your current patching process look like?"',
          '"Can you walk me through how a new device gets set up and deployed?"'
        ]
      },
      {
        label: 'Problem (P)',
        description: 'Surface the pain. Let them name it — don\'t tell them what\'s wrong.',
        items: [
          '"Which endpoint tasks generate the highest ticket volumes for your team?"',
          '"What challenges are you running into with your current toolset?"',
          '"Which tasks still require the most manual effort from your team?"',
          '"How do you get real-time visibility into the security status of all endpoints?"',
          '"Are there devices in your environment you can\'t fully see or manage?"'
        ]
      },
      {
        label: 'Implication (I)',
        description: 'Explore consequences. The goal is for them to feel the weight of the problem.',
        items: [
          '"How does that impact your team\'s response time day-to-day?"',
          '"When something goes wrong, how easy is it to investigate and respond?"',
          '"What happens when you miss a patch window or a device goes unmanaged?"',
          '"How does that affect end-user productivity and satisfaction?"',
          '"What is the business risk if that gap isn\'t addressed?"'
        ]
      },
      {
        label: 'Need-payoff (N)',
        description: 'Get them to articulate the value. Don\'t do it for them.',
        items: [
          '"If that were solved, what would your team be able to focus on instead?"',
          '"What would real-time visibility across every endpoint mean for your team?"',
          '"If you could automate patching and monitoring, how many hours a week would that save?"',
          '"What would an ideal endpoint management setup look like for your team?"',
          '"If your team had more time back each week, where would you want to reinvest it?"'
        ]
      }
    ]
  },
  {
    id: 'aapa',
    icon: '🛡',
    color: 'var(--coral)',
    tag: 'AAPA',
    title: 'Objection handler',
    desc: 'AAPA rebuttal formula + 8 live scenarios',
    count: 8,
    tabs: [
      { label: 'Not interested',   items: [{ scenario: 'Not interested',   A1: 'That\'s exactly why I am calling.', A2: 'It would be a one-in-a-million shot if I called on the day you were evaluating tools. I am good, but not that good!', P: 'This is just a quick call to see if it would even make sense for us to talk when you are assessing your current set up.', Q: 'What is your process for assessing new technology in your business?' }] },
      { label: 'Send me an email', items: [{ scenario: 'Send me an email', A1: 'That\'s exactly why I am calling.', A2: 'I want to make sure you can find us in your inbox when you\'re next evaluating your tools.', P: 'Let me send you something relevant that makes sense for you. There is a breadth and depth to how we can help.', Q: 'When you next assess tools or have a look into improving your tech stack — what is number one on your priority list?' }] },
      { label: 'No time',          items: [{ scenario: 'Call me back / no time', A1: 'That is exactly why I am calling.', A2: 'I don\'t want to talk to you right now.', P: 'I am calling to arrange a time that works for you. The only outcome is to see if we can present any value to you.', Q: 'How do you do your patching?' }] },
      { label: 'Sales call?',      items: [{ scenario: 'Is this a sales call?', A1: 'Yes!', A2: 'We would love to win you as a customer.', P: 'But first it has to make sense. If we can provide value, we will set up a demo. If you like what you see, we will set you up with a free trial. First, let\'s see if this even makes sense.', Q: 'How do you do your patching?' }] },
      { label: 'Have something',   items: [{ scenario: 'We have something in place', A1: 'Great! That\'s exactly why I am calling.', A2: 'Maybe there is no need for you to change anything right now.', P: 'The reason for the call today is just to get a very high-level understanding of how you are doing things now and see if there could be a potential fit.', Q: 'How do you do your patching?' }] },
      { label: 'In contract',      items: [{ scenario: 'Currently in a contract', A1: 'Great! Most of my calls start this way.', A2: 'I am not looking for you to change anything immediately.', P: 'The reason for the call today is just to see if there could be a potential fit at some point in the future.', Q: 'Who are you under contract with? What do you like about it? What do you find to be the best features?' }] },
      { label: 'Not evaluating',   items: [{ scenario: 'Not evaluating right now', A1: 'Great! That\'s exactly why I am calling.', A2: 'The reality is that there may not be a need there — if that is the case this will be a very quick call.', P: 'The reason for the call today is just to get a very high-level understanding of how you are doing things now.', Q: 'When you do evaluate your tools, what is the one thing you will be looking to improve?' }] },
      { label: 'Pricing',          items: [{ scenario: 'Pricing question', A1: 'That\'s a great question!', A2: 'Pricing is agent-based and varies depending on how many endpoints you have and what add-ons you choose.', P: 'Free 14-day trial. Flexible per-device pricing. Free onboarding, training & support. No maintenance fees. Zero hidden fees. Price breaks at: 100, 250, 500, 1000, 2000 endpoints.', Q: 'What budget are you trying to stay within per endpoint?' }] }
    ]
  },
  {
    id: 'bc',
    icon: '⚑',
    color: 'var(--amber)',
    tag: 'Competitors',
    title: 'Battlecards',
    desc: '81 competitors across RMM, MDM, Backup, Remote Access, PSA and AV',
    count: 81,
    tabs: [
      { label: 'Atera',        items: [
        { pain: 'Poor & inefficient Windows & 3rd party patching',      question: 'How\'s Atera\'s Windows and 3rd party patching working out for you?',                    value: 'NinjaOne supports 4k+ 3rd party apps, Windows/Mac/Linux/Android/iOS. #1 patching tool 7 quarters on G2.' },
        { pain: 'Simplistic automation — limited customisation',         question: 'Have you been able to set up any complex automations with Atera to cut back on manual steps?', value: 'NinjaOne supports complex automations: custom fields, script result conditions, multiple automations per condition.' },
        { pain: 'Simplistic reporting — limited granularity',            question: 'How have you found Atera\'s reporting capabilities?',                                      value: 'NinjaOne offers real-time, powerful reporting. Easily generate and distribute branded reports.' },
        { pain: 'Support — slow, poor, sometimes unavailable',           question: 'Have you had any issues with Atera\'s support?',                                           value: 'NinjaOne: avg 30-min response, #1 rated on G2, Capterra, Gartner. Transformational not transactional.' }
      ]},
      { label: 'ConnectWise',  items: [
        { pain: 'Difficult to set up, learn and use — months of implementation', question: 'How long did it take you to get ConnectWise set up?',              value: 'NinjaOne clients learn and set up Ninja in days/weeks vs. months.' },
        { pain: 'Limited 3rd party patching — small app catalogue',              question: 'How has 3rd party patching been for you with ConnectWise?',         value: 'Patch Windows, Mac, Linux, Android & iOS. #1 patching 7 quarters. 4k+ 3rd party apps.' },
        { pain: 'Price — usually much more expensive than NinjaOne',             question: 'How much does price matter when choosing your tools?',              value: 'NinjaOne pricing is per-device. Pay only for what you need. No add-ons required for core features.' },
        { pain: 'Support — slow response, $125/hr after initial 10 hours',       question: 'How has your experience with ConnectWise\'s support been?',         value: 'All NinjaOne support is 100% free for the lifetime of your account. US-based, avg 30-min response.' }
      ]},
      { label: 'Datto',        items: [
        { pain: 'Limited 3rd party patching options',                            question: 'How\'s Datto\'s 3rd party working out? Using an additional tool?',  value: 'Patch over 4k 3rd party apps. #1 patching tool 7 quarters by G2.' },
        { pain: 'Poor and expensive support — $180/hr. Decline since Kaseya',   question: 'How has Datto\'s support been for you?',                             value: 'Ninja\'s #1 rated support is always free. US-based solution engineers.' },
        { pain: 'Remote control requires thick agent — slows the device',        question: 'What do you think about Datto\'s remote control tool?',             value: 'Ninja\'s remote control is 100% web-based. No thick agent. Super-fast and reliable.' },
        { pain: 'No mobile app',                                                  question: 'I\'ve heard Datto doesn\'t have a mobile app. Is that true?',       value: 'Ninja offers a mobile app to monitor and manage all devices on the go.' }
      ]},
      { label: 'Intune',       items: [
        { pain: 'No proactive alerting — reactive, not preventive',              question: 'Do you get proactive alerts on device health before it goes down?',  value: 'Set alerts with Ninja to know about issues before they happen. Agent checks in every 60 seconds.' },
        { pain: 'No real-time management',                                        question: 'Have you deployed software only to find out hours later it failed?', value: 'Ninja\'s agent checks in every 60 seconds — notified immediately on any issues.' },
        { pain: 'No 3rd party patching',                                          question: 'How has third party patching been with Intune?',                    value: 'Patch over 4000 3rd party apps with Ninja + Winget. #1 rated patching G2, 7 quarters.' },
        { pain: 'Time consuming — too many Microsoft add-ons needed',             question: 'How would Intune compare to other tools you\'ve used in the past?', value: 'Manage all devices in one place. Single-pane, intuitive dashboard.' }
      ]},
      { label: 'Kaseya VSA',   items: [
        { pain: 'Difficult to set up and maintain',              question: 'How long did it take to get it set up like you wanted?',           value: 'Set up Ninja in days vs. months. Minimal ongoing management needed.' },
        { pain: 'Complicated UI',                                question: 'Would you say you\'re a big fan of Kaseya\'s user interface?',    value: 'Ninja\'s UI is faster, easier, and takes fewer clicks to do almost anything.' },
        { pain: 'Unreliable support',                            question: 'How responsive has Kaseya\'s support been?',                      value: 'Ninja offers free US-based training, onboarding and support. Avg 30-min response.' },
        { pain: 'Lack of innovation — buying companies vs fixing VSA', question: 'Is there anything you\'re looking for that VSA doesn\'t provide?', value: 'NinjaOne is development-centric. We build most features from the ground up — not bolted-on acquisitions.' }
      ]},
      { label: 'ManageEngine', items: [
        { pain: 'No real-time data, live monitoring or alerts',  question: 'Would you say you have real-time monitoring with ManageEngine?',   value: 'NinjaOne agent checks in every 60 seconds. Real-time monitoring and alerting.' },
        { pain: 'Minimal automation — no condition-based triggers', question: 'How has automation worked out with ManageEngine?',              value: 'NinjaOne offers robust complex automation: multiple scripts, custom fields, condition-based triggers.' },
        { pain: 'Poor support — slow responses for complex issues', question: 'How has support been for you with ManageEngine?',               value: 'NinjaOne transformational support — avg 30-min response, #1 rated year after year.' },
        { pain: 'No centralised policy management',              question: 'Have you had issues with conflicting configs across modules?',      value: 'Ninja centralises decision-making policies that act as "air traffic control" for management.' }
      ]},
      { label: 'N-Able',       items: [
        { pain: 'Delayed actions — scripts and patches can take 5–60 mins', question: 'Has that delay ever happened to you?',                      value: 'Ninja\'s agent checks in every 60 seconds — you\'ll know immediately if scripts succeeded.' },
        { pain: 'Unreliable patching — especially drivers. No Linux',       question: 'How\'s their patching been for you?',                       value: 'Patch: Windows, Mac, Linux, Android & iOS. #1 patching, 7 quarters. 4k+ 3rd party apps.' },
        { pain: 'Not scalable — slow load times at high device counts',     question: 'How\'s that working out for you at scale?',                 value: 'Fast load times and intuitive UI designed to scale as you grow.' },
        { pain: 'Billing complexity — higher price for servers',            question: 'Have you had any issues with the billing?',                 value: 'Simplified billing. Servers same price as workstations. NMS devices cost less than regular endpoints.' }
      ]},
      { label: 'PDQ',          items: [
        { pain: 'Brand new and maturing — RMM still building majority of features', question: 'Have you found PDQ Connect to be a one-stop shop?',  value: 'NinjaOne has been around since 2013. Top-rated EP Management/RMM, patching and support.' },
        { pain: 'Limited patching — just a PowerShell script, no CVE data',         question: 'How has PDQ\'s patching worked out for you?',         value: 'Ninja patches Windows, Mac, Linux, Android & iOS. #1 patching. 4k+ 3rd party apps.' },
        { pain: 'No built-in remote access',                                          question: 'How are you handling remote access? Using a separate tool?', value: 'NinjaOne includes Ninja Remote plus Teamviewer & Splashtop. All one-click access.' },
        { pain: 'Windows only — no Mac or Linux support',                            question: 'How are you managing Mac or Linux devices with PDQ?', value: 'NinjaOne manages Windows, Mac, Linux, Android & iOS from a single pane of glass.' }
      ]}
    ]
  },
  {
    id: 'personas',
    icon: '👤',
    color: 'var(--blue)',
    tag: 'Personas',
    title: 'Buyer personas',
    desc: 'IT buyer profiles and motivations',
    count: 6,
    tabs: [
      { label: 'Head of IT',   description: 'High fit · CTO, CIO, VP of IT, Head of IT · Cares about: strategy, P&L, security posture, cost control, scaling with limited resources.', items: [
        'Opener: "We help Heads of IT simplify endpoint strategy, strengthen security posture, and scale operations without adding tools. How is your endpoint visibility today?"',
        'Key selling point: Ninja helps shift resources to strategic projects by making ops teams more efficient',
        'Key selling point: Ninja reduces ticket volumes, minimises downtime, and improves MTTR',
        'Discovery: "What are you doing to proactively identify warning signs of server and network outage?"',
        'Discovery: "As your company scales, how are you ensuring the same level of support?"',
        'Pain signal: Concerns about security gaps or ransomware exposure. Pressure to reduce vendors or costs.'
      ]},
      { label: 'IT Manager',   description: 'High fit · IT Manager, IT Director, IT Operations Manager · Cares about: standardisation, risk reduction, tool sprawl, real-time visibility.', items: [
        'Opener: "We work with IT managers to simplify endpoint operations, reduce tool sprawl, and improve security. How are you managing endpoints today?"',
        'Key selling point: Ninja gives a single pane for all endpoint management tools and data',
        'Key selling point: Ninja automates repetitive tasks, freeing time for higher-value work',
        'Discovery: "How many tools are you using to manage and secure endpoints?"',
        'Discovery: "Which endpoint tasks take up the most time each week?"',
        'Pain signal: Managing endpoints across too many tools. Limited visibility when leadership asks for answers.'
      ]},
      { label: 'Service Desk', description: 'High fit · VP/Dir of Service Delivery, Help Desk Manager · Cares about: ticket volume, SLA adherence, first-contact resolution.', items: [
        'Opener: "We help Service Desk managers reduce ticket volumes and give teams better endpoint visibility. How is your service desk handling endpoint tickets today?"',
        'Key selling point: Ninja combines helpdesk and endpoint management for full context before tickets begin',
        'Discovery: "Which endpoint issues generate the highest ticket volumes?"',
        'Discovery: "What prevents tickets from being resolved at first contact?"',
        'Pain signal: High volume of repeat or preventable tickets. Escalations caused by lack of endpoint visibility.'
      ]},
      { label: 'SysAdmin',     description: 'High fit · Sysadmin, IT Specialist, IT Engineer · Cares about: control, automation, reliability, fewer manual tasks.', items: [
        'Opener: "We help sysadmins centrally manage, patch, and secure all endpoints without adding complexity. What tools are you using today?"',
        'Key selling point: Ninja gives rich device data and management tools to resolve issues faster',
        'Key selling point: Ninja automates common remediation and maintenance tasks',
        'Discovery: "Which tasks are still handled manually that you wish were automated?"',
        'Pain signal: Scripts breaking or requiring constant maintenance. Spending evenings on failed patches.'
      ]},
      { label: 'C-Level',         description: 'Medium fit (can be detractor) · C-Level, CEO, CFO, COO · Cares about: risk mitigation, security posture, attack surface, alert fatigue.', items: [
        'Opener: "We help C-Level executives reduce risk by automating baseline security processes and providing 360° visibility into the IT portfolio."',
        'Key selling point: Ninja reduces risk by automating patching, maintenance and device configuration',
        'Key selling point: Ninja replaces point solutions, reducing environmental complexity and attack surface',
        'Discovery: "How are you automating patching and device inventories?"',
        'Pain signal: Concerns about audit readiness and continuous compliance evidence.'
      ]},
      { label: 'Technician',   description: 'Medium fit · Help Desk Technician, IT Support Specialist · Cares about: day-to-day speed, less repetitive work, solid monitoring.', items: [
        'Opener: "We help IT teams simplify everyday tasks like patching, remote access, and monitoring. What does your current endpoint management setup look like?"',
        'Key selling point: Ninja gives device data and tools to resolve issues faster, often without interrupting users',
        'Key selling point: Ninja\'s alerting helps proactively identify issues before emergencies',
        'Discovery: "Which tasks still require the most manual effort from your team?"',
        'Pain signal: Repetitive tickets for same device issues. Slow remote access. Needing escalation for simple fixes.'
      ]}
    ]
  },
  {
    id: 'vp',
    icon: '★',
    color: 'var(--green)',
    tag: 'Messaging',
    title: 'Value propositions',
    desc: 'NinjaOne differentiators and proof points',
    count: 8,
    items: [
      'Gartner® Magic Quadrant™ Leader 2026 – Endpoint Management Tools',
      '#1 rated RMM on G2 — fastest onboarding in the industry (days, not months)',
      'Single pane of glass for Windows, Mac, Linux, Android and iOS endpoint management',
      'Patch management across 4,000+ 3rd party apps — #1 patching tool 7 consecutive quarters on G2',
      'Agent checks in every 60 seconds — always-current, real-time data you can always trust',
      'Free, unlimited support. US-based engineers. 30-min avg response time. 98 CSAT score.',
      'Flexible per-device pricing. No hidden fees. No maintenance fees. Free 14-day trial.',
      'Automation-first: automated patching, software deployment, device configuration, and alerting — from one platform'
    ]
  },
  {
    id: 'vuln',
    icon: '🔍',
    color: 'var(--amber)',
    tag: 'Product',
    title: 'Vulnerability scanning',
    desc: 'AI-powered CVE detection messaging',
    count: 8,
    items: [
      'Positioning: "Always Current, Scan-Free Vulnerability Detection. Zero Impact."',
      'AI-powered CVE detection with zero endpoint impact — all evaluation happens in the cloud',
      'Up to 90% of software-related CVEs identified within minutes of a software installation or change',
      'No scan schedules needed — continuous, always-current vulnerability awareness',
      'Integrated with Autonomous Patch Management — detect and remediate in one single platform',
      'Phase 1 (Live): Real-Time Assessment — AI-driven cloud-based CVE correlation, zero endpoint impact',
      'Phase 2 (Coming): Deep Scanning — OVAL-based system-state inspection, covers remaining 10% of CVEs',
      'Compliance-ready: audit evidence automatically captured and continuously updated (CIS, NIS2, DORA)'
    ]
  },
  {
    id: 'cyberessentials',
    icon: '🛡',
    color: 'var(--coral)',
    tag: 'Compliance',
    title: 'Cyber Essentials',
    desc: 'UK framework positioning for IT teams & MSPs',
    count: 4,
    tabs: [
      {
        label: 'Framework basics',
        description: 'UK government-backed certification scheme. Five technical controls prevent up to 80% of common cyber attacks. Delivered through NCSC, managed by IASME, 400+ certification bodies.',
        items: [
          'Cyber Essentials (self-assessment): catalogue of questions across 5 technical control themes — organisation self-certifies and submits for verification',
          'Cyber Essentials+ (independently verified): all of CE, plus a technical audit, vulnerability scans, email & malware tests, and patching verification',
          '1. Firewalls — control traffic between network and external threats. NinjaOne monitors firewall status and alerts on anomalies',
          '2. Secure Configuration — reduce attack surface. NinjaOne scripts detect weak protocols and disabled BitLocker',
          '3. Security Update Management — patch OS and 3rd party apps within 14 days of critical releases. NinjaOne patches 6,000+ applications',
          '4. User Access Control — only authorised users access sensitive systems. MFA enforced platform-wide, admin accounts tracked',
          '5. Malware Protection — AV and EDR monitored continuously, ensuring protection is installed, operational and up to date',
          '"Willow" update (April 2025): 14-day critical patch window (CVSS 7.0+) is now an automatic fail with no exceptions',
          'Willow: MFA is now mandatory across all platforms — admins, technicians, end users. Any gap is an automatic CE+ fail',
          'Willow: all cloud services that store or process org data are now in scope — forgotten SaaS, old instances, shadow IT create gaps',
          'Willow: CE is no longer a point-in-time exercise — it is now explicitly a test of ongoing, day-to-day operational control',
          'Why now: 92% fewer insurance claims for CE-certified orgs (IASME/NCSC) · 43% of UK businesses breached in 2025/26 (CSBS) · 88% of SMB breaches involved ransomware (Verizon DBIR 2025)'
        ]
      },
      {
        label: 'Internal IT questions',
        description: 'IT managers, IT directors, heads of infrastructure. Angle: make their job defensible, reduce personal exposure, help them win budget.',
        items: [
          { question: '"If your CEO asked you today whether you\u2019d pass a Cyber Essentials audit — what would you tell them?"', risk: 'IT leaders are increasingly accountable for outcomes, not effort. \u2018I don\u2019t know\u2019 is not a board-level answer — a breach with known unfixed gaps is regulatory exposure, not bad luck.', value: 'NinjaOne generates the evidence layer: patch compliance, device inventory, AV coverage, firewall status. Go from \u2018we think we\u2019re compliant\u2019 to \u2018here\u2019s the proof\u2019 — pulled in minutes.' },
          { question: '"How much of your team\u2019s week is reactive — chasing patches, responding to alerts, cleaning up after incidents?"', risk: 'Reactive teams can\u2019t maintain proactive compliance. Every hour firefighting is an hour not closing the vulnerabilities CE requires patched within 14 days.', value: 'Policy-based automation handles routine CE tasks with no manual triggers. 71% of customers replace 4+ tools with NinjaOne. Patch deployment time drops 30%.' },
          { question: '"Do you have a single place to see the security and patch status of every device — or are you pulling it from multiple tools?"', risk: 'Fragmented tooling means fragmented visibility. Under Willow, scope now includes all cloud services — making unified visibility harder and more critical at once.', value: 'NinjaOne consolidates hardware, software, patch status, AV, firewalls, and user accounts into one platform. CE reporting is built in, not a manual exercise.' },
          { question: '"When your CE renewal comes around, how long does it take to prepare — and who does that work fall on?"', risk: 'Orgs treating CE as an annual sprint are non-compliant between renewals — they just haven\u2019t been tested. Willow\u2019s 14-day window makes this untenable.', value: 'NinjaOne turns CE from an annual fire drill into a continuous state. CVSS alerting flags vulnerabilities the moment they\u2019re published. By renewal — you\u2019re already there.' },
          { question: '"If you had an incident today — ransomware, a compromised account, a rogue device — how fast would you actually know about it?"', risk: 'Without continuous monitoring, the average breach goes undetected for weeks. UK GDPR requires ICO notification within 72 hours of becoming aware.', value: 'NinjaOne monitors endpoints continuously — disabled firewalls, AV going offline, config drift. Integrates with SentinelOne/CrowdStrike. CE is prevention; NinjaOne is what happens when prevention isn\u2019t enough.' }
        ]
      },
      {
        label: 'MSP questions',
        description: 'Owners, directors, heads of service delivery. Angle: commercial — every question maps to revenue capture, margin, client stickiness, or new business.',
        items: [
          { question: '"Are your clients asking about Cyber Essentials — and are you the one helping them get there, or are they going elsewhere?"', risk: 'MSPs not offering CE as a service risk losing the revenue to a specialist — and the trusted-advisor relationship that follows.', value: 'NinjaOne maps to 25 CE control categories with automated reporting, built once, deployed at scale. Go to market with a managed CE service — recurring revenue at defensible margin.' },
          { question: '"If you\u2019re going to offer Cyber Essentials as a service, how are you planning to evidence compliance across every client without it becoming a manual job?"', risk: 'MSPs building CE delivery on manual processes see margin collapse as the client base grows. Inconsistent delivery creates liability if a client fails their audit.', value: 'Multi-tenant architecture lets you patch and report across your entire client base simultaneously. Meet the 14-day window for every client from one platform.' },
          { question: '"How sticky are your client relationships right now — and what would it take for a client to justify switching to a different MSP?"', risk: 'MSPs competing on price or familiarity face constant commoditisation. Switching means the client loses compliance history and audit trails.', value: 'Audit trail and reporting build a compliance record that lives in your platform — patch history, device changes, user activity. Institutional knowledge the client can\u2019t walk away from.' },
          { question: '"When one of your clients has a security incident, what does that cost your team — and how does it affect the profitability of that relationship?"', risk: 'A client ransomware event can consume hundreds of engineering hours, often at cost, under SLA pressure — with legal exposure if controls should have been maintained.', value: 'Continuous monitoring alerts your team proactively before incidents become crises. Fewer incidents means less reactive load, better margins, stronger renewal conversations.' },
          { question: '"How are you currently winning new clients — and is cybersecurity compliance something you use as a differentiator in those conversations?"', risk: 'MSPs without a compliance-led offering compete on cost and lose on value. The first MSP offering \u2018we handle your Cyber Essentials\u2019 wins the relationship.', value: 'NinjaOne + IQ in IT (certified CE body, NinjaOne partner) gives a complete, credentialled offering — platform, automation, and certification body relationship in one.' }
        ]
      },
      {
        label: 'NinjaOne mapping',
        description: 'NinjaOne covers 25 CE control categories, directly mapped to the CE assessment question set.',
        items: [
          'Firewalls — A4.11 Software Firewalls',
          'Secure Config — A5.1 Remove Unused Software · A5.2 Remove User Accounts · A5.3 Change Default Passwords · A5.8 Auto-Run Disabled · A5.9–10 Device Locking',
          'Update Management — A6.1 Supported OS · A6.2–6.6 Software & Updates (6 categories) · A6.4–6.5 Security Updates (4 categories)',
          'User Access — A7.1 Account Creation · A7.3 Leavers Accounts · A7.6 Admin Account Use · A7.8 Admin Tracking · A7.10 Brute Force Protection',
          'Malware Protection — A6.2.2 Malware Protection (AV/EDR monitoring)',
          'Next step: run the discovery questions with your next IT or MSP prospect — even one question opens the gap',
          'Next step: reference the IQ in IT partnership to give MSPs a credentialled pathway to offer CE as a managed service',
          'Next step: use the NinjaOne 25-category mapping as leave-behind evidence of platform coverage'
        ]
      }
    ]
  },
  {
    id: 'qual',
    icon: '✔',
    color: 'var(--blue)',
    tag: 'Qualification',
    title: 'Qualification',
    desc: 'SPIN, environment fit, decision process & disqualifiers',
    count: 4,
    tabs: [
      {
        label: 'SPIN',
        description: 'Qualify Budget, Authority, Need and Timeline before investing further time.',
        items: [
          'BUDGET — "Do you have a budget allocated for endpoint management tooling this year?"',
          'BUDGET — "Is there a rough per-device or total budget range you are working within?"',
          'BUDGET — "Would cost savings from consolidating tools factor into the decision?"',
          'AUTHORITY — "Who else would be involved in evaluating or signing off on a new tool?"',
          'AUTHORITY — "Is the final decision made by IT, procurement, or the business?"',
          'AUTHORITY — "Would you be the main champion internally, or is there someone above you who needs to be on board?"',
          'NEED — "What is the number one thing you are looking to improve in your current setup?"',
          'NEED — "How long has this been a problem, and what has stopped you from solving it so far?"',
          'NEED — "If nothing changed in the next 12 months, what would the impact be?"',
          'TIMELINE — "When are you looking to have a new solution in place?"',
          'TIMELINE — "Are you actively evaluating tools right now or is this more exploratory?"',
          'TIMELINE — "Is there a contract renewal, audit, or business event driving the timeline?"'
        ]
      },
      {
        label: 'Environment fit',
        description: 'Confirm the technical environment is a strong fit for NinjaOne before progressing to demo.',
        items: [
          '"How many endpoints are you managing in total across all locations?"',
          '"What is your OS split — Windows, Mac, Linux? Any mobile devices (Android / iOS)?"',
          '"Are your devices primarily on-premise, remote, or a mix?"',
          '"What tools are you currently using for patching, monitoring, and remote access?"',
          '"Are you managing all endpoints yourself or do you use an MSP for any of it?"',
          '"Do you have any compliance requirements — CIS, ISO27001, NIS2, DORA — that affect your tooling?"',
          '"How many IT staff are responsible for managing these endpoints day-to-day?"',
          '"Do you have any Linux servers or specialised infrastructure that needs to be managed?"',
          'Minimum fit: 100+ endpoints, at least one active pain point, self-managed or looking to bring in-house'
        ]
      },
      {
        label: 'Decision process',
        description: 'Understand how decisions get made so you can navigate the deal correctly.',
        items: [
          '"What does your evaluation process typically look like for a tool like this?"',
          '"Have you gone through a formal procurement process for IT tools before?"',
          '"Who would need to be involved in a demo — just you or a wider team?"',
          '"Would you need a business case or ROI justification to get sign-off?"',
          '"Is there a preferred vendor list or procurement framework you need to work within?"',
          '"What would need to be true for you to feel confident recommending NinjaOne internally?"',
          '"What has caused evaluations like this to stall or fail in the past?"',
          '"If the demo goes well, what is the realistic next step from your side?"'
        ]
      },
      {
        label: 'Disqualifiers',
        description: 'Red flags that indicate the deal should be paused, parked, or walked away from.',
        items: [
          '🔴 Fewer than 100 endpoints and no growth planned — too small for meaningful ROI',
          '🔴 No budget available this financial year and no timeline to revisit',
          '🔴 Working with an MSP that uses NinjaOne — do not proceed, mark as Do Not Contact in SF',
          '🔴 Working with an MSP, unknown tool, fewer than 250 devices — tread carefully, do not push',
          '🔴 Decision maker not engaged — only speaking to a low-level influencer with no access to budget holder',
          '🔴 Currently locked into a multi-year contract with no break clause and no evaluation planned',
          '🔴 No active pain — happy with current tool, no compliance pressure, no growth — park for 6 months',
          '🟡 Only Windows devices, no Mac/Linux — still a fit but reduced differentiation on cross-platform',
          '🟡 Very small IT team (1 person) — may need a simpler onboarding path, flag for SE',
          '✅ If MSP uses a competitor tool and company has 250+ devices — worth exploring in-house move'
        ]
      }
    ]
  }

]
