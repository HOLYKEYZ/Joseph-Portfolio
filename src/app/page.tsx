'use client';

import { useState, useEffect } from 'react';

// Typewriter component
function Typewriter() {
  const titles = ["AI engineer", "fullstack developer", "ML researcher"];
  const [displayText, setDisplayText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = titles[titleIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentTitle.length) {
          setDisplayText(currentTitle.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentTitle.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, titleIndex, titles]);

  return (
    <div className="font-display text-accent mb-6 min-h-[1.6em] flex justify-center items-center gap-2">
      <span>{displayText}</span>
      <span className="w-[2px] h-[1.2em] bg-accent cursor-blink inline-block" />
    </div>
  );
}

// Skill Tag component
function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="skill-tag-hover bg-white/5 px-3 py-2 rounded text-sm text-text-secondary border border-transparent">
      {children}
    </span>
  );
}

// Project Tag component
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 bg-white/5 rounded text-text-secondary border border-transparent">
      {children}
    </span>
  );
}

// Skill Card component
function SkillCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card-hover bg-card border border-border-subtle p-8 rounded-2xl">
      <h3 className="mb-6 text-text-primary text-xl flex items-center gap-2 font-display">
        <i className={icon}></i> {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {children}
      </div>
    </div>
  );
}

// Project Card component
function ProjectCard({
  image,
  title,
  icon,
  description,
  tags,
  links
}: {
  image: string;
  title: string;
  icon: string;
  description: string;
  tags: string[];
  links: { href: string; label: string; icon: string }[];
}) {
  return (
    <article className="card-hover bg-card border border-border-subtle rounded-2xl overflow-hidden flex flex-col">
      <div className="h-[220px] relative overflow-hidden border-b border-border-subtle">
        <img
          src={image}
          alt={title}
          className="img-zoom w-full h-full object-contain object-center bg-card brightness-95"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">{title}</span>
          <i className={`${icon} text-accent text-lg`}></i>
        </div>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed flex-1">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
        </div>
        <div className="flex gap-4 pt-4 border-t border-border-subtle">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-text-primary hover:text-accent flex items-center gap-1.5 transition-colors"
            >
              <i className={link.icon}></i> {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

// Model/Dataset Card component
function ModelCard({ 
  name, 
  type, 
  description, 
  hfUrl 
}: { 
  name: string; 
  type: 'model' | 'dataset'; 
  description: string; 
  hfUrl: string;
}) {
  const [downloads, setDownloads] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        // Extract repo path correctly based on type
        const repoPath = type === 'dataset'
          ? hfUrl.split('huggingface.co/datasets/')[1]
          : hfUrl.split('huggingface.co/')[1];
        const apiUrl = `https://huggingface.co/api/${type}s/${repoPath}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Read downloads field directly from the response
        setDownloads(data.downloads || 0);
      } catch (error) {
        console.error('Error fetching downloads:', error);
        setDownloads(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [hfUrl, type]);

  const formatDownloads = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}k+`;
    }
    return `${num}+`;
  };

  return (
    <div className="bg-card border border-border-subtle rounded-xl p-6 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <i className={`fa-solid ${type === 'model' ? 'fa-brain' : 'fa-database'} text-accent text-xl`}></i>
          <h3 className="text-lg font-bold text-text-primary">{name}</h3>
        </div>
        {!loading && downloads !== null && (
          <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
            {formatDownloads(downloads)} downloads
          </span>
        )}
        {loading && (
          <span className="text-xs px-2 py-1 bg-white/5 text-text-secondary rounded animate-pulse">
            loading...
          </span>
        )}
      </div>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <a 
        href={hfUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2.5 15a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3.5-4H6c-.4-2.1.5-4.4 2.5-5.6l-.9-1.5c-.2-.3-.1-.6.2-.8.3-.2.6-.1.8.2l.9 1.6c.8-.3 1.6-.4 2.5-.4s1.7.1 2.5.4l.9-1.6c.2-.3.5-.4.8-.2.3.2.4.5.2.8l-.9 1.5C17.5 6.6 18.4 8.9 18 11z"/>
        </svg>
        View on HuggingFace
      </a>
    </div>
  );
}

export default function Home() {
  const projects = [
    {
      image: "/gitpulse.png",
      title: "GitPulse",
      icon: "fa-solid fa-code-branch",
      description: "Developer-first social platform built on GitHub. Share updates, ship releases, discover trending projects with real-time SSE feeds and GitHub Actions integration.",
      tags: ["Next.js", "PostgreSQL", "Prisma", "NextAuth"],
      links: [
        { href: "https://gitpulsefeed.vercel.app", label: "live demo", icon: "fa-solid fa-arrow-up-right-from-square" },
        { href: "https://github.com/HOLYKEYZ/git-pulse", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/unfetter_proxy.png",
      title: "Unfetter Proxy",
      icon: "fa-solid fa-shield-halved",
      description: "Universal reverse proxy for persistent closed-model unfettering. Intercepts API calls to apply token suppression, system injection, and automated jailbreak loops (PARE).",
      tags: ["Python", "FastAPI", "red teaming"],
      links: [
        { href: "https://github.com/HOLYKEYZ/unfetter_proxy", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/swarms.png",
      title: "SWARMs Debate Primitive",
      icon: "fa-solid fa-network-wired",
      description: "Multi-agent debate and vote coordination system on Solana blockchain. Agents assume distinct personas to debate complex questions, with full session transcripts hashed and recorded on-chain for verifiable AI consensus.",
      tags: ["Python", "Solana", "multi-agent", "blockchain"],
      links: [
        { href: "https://github.com/HOLYKEYZ/Swarms", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/intellectsafe.png",
      title: "IntellectSafe",
      icon: "fa-solid fa-lock",
      description: "AI safety engine with multi-model LLM Council, Universal Proxy for frontier models, deepfake detection, and adversarial defense suite.",
      tags: ["fastAPI", "next.js", "AI Safety"],
      links: [
        { href: "https://intellect-safe.vercel.app", label: "live demo", icon: "fa-solid fa-arrow-up-right-from-square" },
        { href: "https://github.com/HOLYKEYZ/IntellectSafe", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/modelfang.png",
      title: "ModelFang",
      icon: "fa-solid fa-mask",
      description: "Graph-based adversarial testing framework for LLMs with multi-turn jailbreak attacks, FSM evaluator, and real-time analyst dashboard.",
      tags: ["python", "next.js", "red teaming"],
      links: [
        { href: "https://model-fang.vercel.app", label: "live demo", icon: "fa-solid fa-arrow-up-right-from-square" },
        { href: "https://github.com/HOLYKEYZ/ModelFang", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/hadnx.png",
      title: "HADNX",
      icon: "fa-solid fa-network-wired",
      description: "Hybrid DAST platform with header/TLS/cookie analysis, integrated Nuclei/ZAP/SQLMap/Nmap tools, and AI security consultant.",
      tags: ["django", "rest", "next.js", "celery/redis"],
      links: [
        { href: "https://hadnx.vercel.app", label: "live demo", icon: "fa-solid fa-arrow-up-right-from-square" },
        { href: "https://github.com/HOLYKEYZ/HADNX", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/vulnrix_new.png",
      title: "VULNRIX",
      icon: "fa-solid fa-shield-virus",
      description: "All-in-one SAST/SCA code scanner with fast/hybrid modes, virusTotal integration, and full digital footprint OSINT suite.",
      tags: ["python/flask", "AI verification", "SAST/SCA"],
      links: [
        { href: "https://vulnrix.onrender.com/", label: "use tool", icon: "fa-solid fa-arrow-up-right-from-square" },
        { href: "https://github.com/HOLYKEYZ/VULNRIX", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/alexcathe.png",
      title: "Alexcathe",
      icon: "fa-solid fa-helmet-safety",
      description: "Modern construction & engineering platform featuring premium dark UI and high-performance animations.",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      links: [
        { href: "https://alexcathe.vercel.app/", label: "live demo", icon: "fa-solid fa-external-link-alt" }
      ]
    },
    {
      image: "/KELEGAM.png",
      title: "Kelagam Tech",
      icon: "fa-solid fa-rocket",
      description: "Premium multi-page enterprise platform featuring digital showcases and modern dark/light UI design.",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      links: [
        { href: "https://kelegam-tech.vercel.app/", label: "live demo", icon: "fa-solid fa-external-link-alt" }
      ]
    },
    {
      image: "/vector_projection.png",
      title: "Model Unfetter",
      icon: "fa-solid fa-unlock",
      description: "Directional ablation engine for LLM unalignment. Projects and removes refusal directions from model weights while maintaining capabilities.",
      tags: ["python", "red teaming", "research"],
      links: [
        { href: "https://github.com/HOLYKEYZ/model-unfetter", label: "source", icon: "fa-brands fa-github" }
      ]
    },
    {
      image: "/mayo_flowchart.png",
      title: "Mayo",
      icon: "fa-solid fa-robot",
      description: "Autonomous triple-AI engine that analyzes codebases and opens validated PRs hourly with cross-repo global memory.",
      tags: ["python", "agentic AI", "GitHub"],
      links: [
        { href: "https://github.com/HOLYKEYZ/mayo", label: "source", icon: "fa-brands fa-github" }
      ]
    }
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full h-[70px] nav-glass border-b border-border-subtle z-50 flex items-center">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <a href="#" className="font-display text-2xl font-bold text-text-primary">
            AJ<span className="text-accent">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-8 list-none">
            <li><a href="#about" className="text-text-secondary hover:text-text-primary text-[15px] font-medium transition-colors">about</a></li>
            <li><a href="#skills" className="text-text-secondary hover:text-text-primary text-[15px] font-medium transition-colors">tech stack</a></li>
            <li><a href="#work" className="text-text-secondary hover:text-text-primary text-[15px] font-medium transition-colors">work</a></li>
            <li><a href="#contact" className="text-text-secondary hover:text-text-primary text-[15px] font-medium transition-colors">contact</a></li>
            <div className="flex gap-4 ml-4 pl-4 border-l border-border-subtle">
              <a href="https://github.com/HOLYKEYZ" target="_blank" className="text-text-secondary hover:text-text-primary text-lg transition-colors">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://huggingface.co/josephmayo" target="_blank" className="text-text-secondary hover:text-text-primary text-lg transition-colors flex items-center justify-center" title="HuggingFace">
                <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475 439">
                  <path d="M235.793 396.126a187.281 187.281 0 00187.285-187.284A187.283 187.283 0 00235.793 21.558 187.287 187.287 0 0048.509 208.842a187.286 187.286 0 00187.284 187.284z"/>
                  <path d="M423.078 208.842A187.283 187.283 0 00235.793 21.558 187.283 187.283 0 0048.509 208.842a187.283 187.283 0 00319.714 132.43 187.284 187.284 0 0054.855-132.43zm-396.127 0a208.842 208.842 0 11417.685 0 208.842 208.842 0 01-417.685 0z"/>
                  <path d="M296.641 157.912c6.898 2.371 9.593 16.491 16.545 12.827a26.946 26.946 0 008.24-40.841 26.952 26.952 0 00-28.632-8.767 26.942 26.942 0 00-19.055 23.099 26.943 26.943 0 003.014 15.352c3.288 6.198 13.744-3.88 19.941-1.724l-.053.054zm-126.923 0c-6.898 2.371-9.647 16.491-16.545 12.827a26.946 26.946 0 01-8.24-40.841 26.952 26.952 0 0128.632-8.767 26.944 26.944 0 0116.041 38.451c-3.288 6.198-13.797-3.88-19.941-1.724l.053.054z"/>
                  <path d="M234.446 287.205c52.979 0 70.063-47.212 70.063-71.464 0-12.612-8.461-8.624-22.043-1.941-12.557 6.198-29.426 14.768-47.966 14.768-38.75 0-70.063-37.08-70.063-12.827 0 24.252 17.031 71.464 70.063 71.464h-.054z"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M193.863 274.863a46.895 46.895 0 0128.565-24.199c2.155-.646 4.365 3.072 6.682 6.899 2.156 3.665 4.42 7.384 6.683 7.384 2.426 0 4.851-3.665 7.168-7.276 2.426-3.773 4.797-7.438 7.115-6.737a46.403 46.403 0 0126.947 22.474c20.103-15.845 27.486-41.715 27.486-57.667 0-12.612-8.461-8.624-22.043-1.941l-.754.378c-12.45 6.198-29.05 14.39-47.266 14.39-18.216 0-34.762-8.192-47.266-14.39-14.012-6.953-22.797-11.318-22.797 1.563 0 16.438 7.869 43.439 29.48 59.122z"/>
                  <path d="M362.446 183.242a17.515 17.515 0 10.002-35.03 17.515 17.515 0 00-.002 35.03zm-250.61 0a17.515 17.515 0 100-35.03 17.515 17.515 0 000 35.03z"/>
                </svg>
              </a>
              <a href="https://x.com/jos44711" target="_blank" className="text-text-secondary hover:text-text-primary text-lg transition-colors">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="mailto:ayandajoseph390@gmail.com" className="text-text-secondary hover:text-text-primary text-lg transition-colors">
                <i className="fa-solid fa-envelope"></i>
              </a>
              <a href="https://wa.me/2349019029665" target="_blank" className="text-text-secondary hover:text-text-primary text-lg transition-colors">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </ul>

          <button className="md:hidden text-text-primary text-2xl bg-transparent border-none cursor-pointer">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="min-h-screen flex items-center justify-center pt-[70px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.9)), url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-8 max-w-[800px] text-center z-10">
          <Typewriter />

          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight mb-6 text-white animate-slide-up animate-slide-up-delay-1" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            building impactful AI<br />for the future.
          </h1>

          <p className="text-xl text-gray-300 max-w-[600px] mx-auto mb-10 animate-slide-up animate-slide-up-delay-2">
            crafting intelligent systems and innovative software that drive real-world impact and push the boundaries of what&apos;s possible.
          </p>

          <div className="flex gap-4 justify-center animate-slide-up animate-slide-up-delay-3">
            <a href="#work" className="px-6 py-3 rounded-lg font-semibold bg-white text-background hover:bg-gray-100 transition-all flex items-center gap-2 no-underline">
              view work <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl mb-16 text-center font-display">about me</h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="mb-6 text-text-secondary text-lg">
                i am an <span className="text-text-primary font-medium">AI engineer and fullstack developer</span> driven by a singular mission: building impactful software that pushes the boundaries of innovation and solves real-world problems.
              </p>
              <p className="mb-6 text-text-secondary text-lg">
                from training and fine-tuning language models to architecting full-stack applications, i specialize in <span className="text-text-primary font-medium">machine learning engineering, AI safety research, and agentic systems</span>. my work spans model development, red teaming protocols, and building intelligent infrastructures that drive meaningful impact.
              </p>
              <p className="font-bold text-white text-xl">
                my work bridges cutting-edge ML research with production-ready software engineering.
              </p>
            </div>

            <div className="mission-card rounded-2xl p-8 min-h-[520px] border border-border-subtle relative overflow-hidden bg-card">
              <div className="absolute inset-0 bg-cover bg-no-repeat bg-center mission-card-bg" style={{ backgroundImage: 'url(/joseph.jpeg)', filter: 'brightness(0.9) contrast(1.1)', backgroundPosition: 'center 20%' }} />
              <div className="absolute inset-0 bg-black/50 mission-card-overlay" />
              <div className="relative z-10 mission-card-content">
                <h3 className="mb-6 text-text-primary text-xl">
                  <i className="fa-solid fa-bullseye text-accent mr-2"></i> core mission
                </h3>
                <ul className="list-none flex flex-col gap-4 text-text-secondary">
                  <li><i className="fa-solid fa-check text-accent mr-2"></i> impactful AI innovation</li>
                  <li><i className="fa-solid fa-check text-accent mr-2"></i> ML engineering & research</li>
                  <li><i className="fa-solid fa-check text-accent mr-2"></i> agentic systems</li>
                  <li><i className="fa-solid fa-check text-accent mr-2"></i> fullstack development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="skills" className="py-24">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl mb-16 text-center font-display">tech arsenal</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkillCard icon="fa-solid fa-microchip" title="systems & core">
              <SkillTag>C</SkillTag>
              <SkillTag>holy C</SkillTag>
              <SkillTag>python</SkillTag>
              <SkillTag>typeScript</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-code" title="frontend">
              <SkillTag>react</SkillTag>
              <SkillTag>next.js</SkillTag>
              <SkillTag>javaScript</SkillTag>
              <SkillTag>tailwind CSS</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-server" title="backend">
              <SkillTag>fastAPI</SkillTag>
              <SkillTag>node.js</SkillTag>
              <SkillTag>express</SkillTag>
              <SkillTag>django</SkillTag>
              <SkillTag>flask</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-database" title="databases">
              <SkillTag>postgreSQL</SkillTag>
              <SkillTag>sqlite</SkillTag>
              <SkillTag>redis</SkillTag>
              <SkillTag>neon db</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-toolbox" title="tools & cloud">
              <SkillTag>google cloud / aws</SkillTag>
              <SkillTag>vercel / render</SkillTag>
              <SkillTag>github</SkillTag>
              <SkillTag>rest APIs</SkillTag>
              <SkillTag>docker</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-brain" title="ML & deep learning">
              <SkillTag>PyTorch</SkillTag>
              <SkillTag>transformers</SkillTag>
              <SkillTag>hugging face</SkillTag>
              <SkillTag>model training</SkillTag>
              <SkillTag>fine-tuning</SkillTag>
            </SkillCard>

            <SkillCard icon="fa-solid fa-crosshairs" title="current focus">
              <SkillTag>ML engineering</SkillTag>
              <SkillTag>ai safety research</SkillTag>
              <SkillTag>agentic systems</SkillTag>
              <SkillTag>fullstack dev</SkillTag>
            </SkillCard>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-24">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl mb-16 text-center font-display">selected projects</h2>

          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          <div className="flex justify-center mt-12 mb-4">
            <a
              href="https://github.com/HOLYKEYZ?tab=repositories"
              target="_blank"
              className="w-full max-w-[250px] p-4 bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-xl flex items-center justify-center gap-3 transition-all no-underline hover:border-[#555]"
            >
              <i className="fa-brands fa-github text-white text-lg"></i>
              <span className="text-[#ccc] font-display text-[15px] font-medium">View All Projects</span>
              <i className="fa-solid fa-arrow-right text-accent text-sm"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Models & Datasets Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl mb-16 text-center font-display">models & datasets</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <ModelCard
              name="Qwopus 9B Unfettered"
              type="model"
              description="Uncensored 9B parameter language model. Directional ablation applied to remove refusal mechanisms while maintaining capabilities."
              hfUrl="https://huggingface.co/josephmayo/Qwopus-9B-Unfettered"
            />

            <ModelCard
              name="Qwopus 9B Unfettered GGUF"
              type="model"
              description="Quantized GGUF version of Qwopus 9B Unfettered for efficient local inference with llama.cpp and Ollama."
              hfUrl="https://huggingface.co/josephmayo/Qwopus-9B-Unfettered-GGUF"
            />

            <ModelCard
              name="Qwen2.5 0.5B Unfettered"
              type="model"
              description="Lightweight 0.5B parameter uncensored model based on Qwen2.5. Optimized for edge deployment and resource-constrained environments."
              hfUrl="https://huggingface.co/josephmayo/Qwen2.5-0.5B-Unfettered"
            />

            <ModelCard
              name="Refusal Compliance Pairs"
              type="dataset"
              description="Curated dataset of 200+ refusal-compliance prompt pairs for AI safety research and red teaming evaluation."
              hfUrl="https://huggingface.co/datasets/josephmayo/refusal-compliance-pairs"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t border-border-subtle py-16 text-center">
        <div className="container mx-auto px-8">
          <h2 className="mb-8 text-3xl">let&apos;s build something impactful & innovative</h2>
          <div className="flex justify-center gap-8 mb-8">
            <a href="https://github.com/HOLYKEYZ" target="_blank" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="https://huggingface.co/josephmayo" target="_blank" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1 flex items-center justify-center" title="HuggingFace">
              <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475 439">
                <path d="M235.793 396.126a187.281 187.281 0 00187.285-187.284A187.283 187.283 0 00235.793 21.558 187.287 187.287 0 0048.509 208.842a187.286 187.286 0 00187.284 187.284z" fill="#FFD21E"/>
                <path d="M423.078 208.842A187.283 187.283 0 00235.793 21.558 187.283 187.283 0 0048.509 208.842a187.283 187.283 0 00319.714 132.43 187.284 187.284 0 0054.855-132.43zm-396.127 0a208.842 208.842 0 11417.685 0 208.842 208.842 0 01-417.685 0z" fill="#FF9D0B"/>
                <path d="M296.641 157.912c6.898 2.371 9.593 16.491 16.545 12.827a26.946 26.946 0 008.24-40.841 26.952 26.952 0 00-28.632-8.767 26.942 26.942 0 00-19.055 23.099 26.943 26.943 0 003.014 15.352c3.288 6.198 13.744-3.88 19.941-1.724l-.053.054zm-126.923 0c-6.898 2.371-9.647 16.491-16.545 12.827a26.946 26.946 0 01-8.24-40.841 26.952 26.952 0 0128.632-8.767 26.944 26.944 0 0116.041 38.451c-3.288 6.198-13.797-3.88-19.941-1.724l.053.054z" fill="#3A3B45"/>
                <path d="M234.446 287.205c52.979 0 70.063-47.212 70.063-71.464 0-12.612-8.461-8.624-22.043-1.941-12.557 6.198-29.426 14.768-47.966 14.768-38.75 0-70.063-37.08-70.063-12.827 0 24.252 17.031 71.464 70.063 71.464h-.054z" fill="#FF323D"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M193.863 274.863a46.895 46.895 0 0128.565-24.199c2.155-.646 4.365 3.072 6.682 6.899 2.156 3.665 4.42 7.384 6.683 7.384 2.426 0 4.851-3.665 7.168-7.276 2.426-3.773 4.797-7.438 7.115-6.737a46.403 46.403 0 0126.947 22.474c20.103-15.845 27.486-41.715 27.486-57.667 0-12.612-8.461-8.624-22.043-1.941l-.754.378c-12.45 6.198-29.05 14.39-47.266 14.39-18.216 0-34.762-8.192-47.266-14.39-14.012-6.953-22.797-11.318-22.797 1.563 0 16.438 7.869 43.439 29.48 59.122z" fill="#3A3B45"/>
                <path d="M362.446 183.242a17.515 17.515 0 10.002-35.03 17.515 17.515 0 00-.002 35.03zm-250.61 0a17.515 17.515 0 100-35.03 17.515 17.515 0 000 35.03zM75.78 242.526c-8.731 0-16.492 3.557-21.935 10.079a32.173 32.173 0 00-7.168 20.264 38.275 38.275 0 00-10.456-1.617c-8.353 0-15.899 3.18-21.234 8.947a31.257 31.257 0 00-4.312 37.726 28.566 28.566 0 00-9.647 15.198 31.512 31.512 0 004.312 25.546 28.136 28.136 0 00-1.995 27.056c5.498 12.503 19.24 22.312 45.919 32.875 16.545 6.576 31.744 10.779 31.851 10.833a238.92 238.92 0 0058.907 8.623c31.583 0 54.165-9.701 67.153-28.779 20.911-30.666 17.947-58.746-9.162-85.801-14.929-14.983-24.899-37.025-26.947-41.876-4.204-14.336-15.306-30.289-33.684-30.289a30.716 30.716 0 00-24.792 13.258c-5.389-6.79-10.671-12.126-15.414-15.198a39.885 39.885 0 00-21.396-6.845zm0 21.558c2.749 0 6.144 1.186 9.809 3.503 11.533 7.33 33.684 45.434 41.822 60.255 2.695 4.958 7.384 7.06 11.534 7.06 8.353 0 14.821-8.246.808-18.755-21.127-15.792-13.743-41.607-3.665-43.17.431-.108.916-.108 1.294-.108 9.162 0 13.204 15.791 13.204 15.791s11.857 29.75 32.229 50.122c20.318 20.319 21.396 36.649 6.575 58.368-10.132 14.821-29.48 19.295-49.368 19.295-20.533 0-41.66-4.851-53.463-7.869-.593-.162-72.489-20.48-63.38-37.726 1.509-2.911 4.042-4.096 7.222-4.096 12.826 0 36.11 19.078 46.187 19.078 2.21 0 3.773-.916 4.474-3.233 4.257-15.36-64.997-21.828-59.177-44.032 1.078-3.935 3.827-5.498 7.761-5.498 16.923 0 54.973 29.804 62.95 29.804.592 0 1.077-.161 1.293-.539 3.988-6.467 1.778-10.994-26.409-28.025-28.079-17.031-47.858-27.271-36.648-39.505 1.293-1.401 3.126-2.048 5.39-2.048 17.084 0 57.451 36.756 57.451 36.756s10.887 11.318 17.516 11.318c1.509 0 2.802-.539 3.665-2.048 4.635-7.868-43.44-44.301-46.134-59.338-1.833-10.24 1.293-15.36 7.06-15.36z" fill="#FF9D0B"/>
                <path d="M189.39 397.15c14.821-21.773 13.743-38.103-6.575-58.422-20.372-20.318-32.229-50.122-32.229-50.122s-4.419-17.246-14.498-15.629c-10.078 1.617-17.462 27.378 3.665 43.169 21.073 15.792-4.204 26.517-12.342 11.696-8.084-14.821-30.289-52.925-41.822-60.255-11.48-7.276-19.564-3.233-16.87 11.857 2.696 15.037 50.824 51.47 46.135 59.284-4.689 7.923-21.181-9.216-21.181-9.216s-51.577-46.942-62.841-34.708c-11.21 12.234 8.569 22.474 36.648 39.505 28.187 17.031 30.397 21.558 26.409 28.025-4.042 6.468-66.183-45.972-72.004-23.713-5.82 22.15 63.434 28.564 59.177 43.924-4.312 15.36-48.829-28.996-57.883-11.749-9.162 17.3 62.787 37.618 63.38 37.78 23.175 6.036 82.189 18.809 102.831-11.426z" fill="#FFD21E"/>
                <path d="M398.502 242.526c8.731 0 16.545 3.557 21.935 10.079a32.173 32.173 0 017.168 20.264 38.272 38.272 0 0110.509-1.617c8.354 0 15.899 3.18 21.235 8.947a31.257 31.257 0 014.311 37.726 28.564 28.564 0 019.594 15.198 31.513 31.513 0 01-4.312 25.546 28.142 28.142 0 011.994 27.056c-5.497 12.503-19.24 22.312-45.864 32.875-16.6 6.576-31.798 10.779-31.906 10.833a238.914 238.914 0 01-58.907 8.623c-31.582 0-54.164-9.701-67.153-28.779-20.911-30.667-17.947-58.746 9.162-85.801 14.983-14.983 24.954-37.026 27.002-41.876 4.203-14.336 15.252-30.289 33.63-30.289a30.716 30.716 0 0124.792 13.258c5.389-6.791 10.671-12.126 15.467-15.198a39.888 39.888 0 0121.343-6.845zm0 21.558c-2.749 0-6.09 1.186-9.809 3.503-11.48 7.33-33.684 45.434-41.822 60.255a13.106 13.106 0 01-11.534 7.06c-8.3 0-14.821-8.246-.754-18.756 21.072-15.791 13.689-41.606 3.61-43.169a8.233 8.233 0 00-1.293-.108c-9.162 0-13.204 15.791-13.204 15.791s-11.857 29.75-32.175 50.122c-20.373 20.319-21.45 36.649-6.576 58.368 10.079 14.821 29.481 19.295 49.314 19.295 20.588 0 41.661-4.851 53.518-7.869.539-.162 72.488-20.48 63.38-37.726-1.563-2.911-4.042-4.096-7.222-4.096-12.827 0-36.163 19.078-46.188 19.078-2.263 0-3.826-.916-4.473-3.233-4.312-15.36 64.943-21.828 59.122-44.032-1.024-3.935-3.772-5.498-7.76-5.498-16.923 0-54.973 29.804-62.949 29.804-.539 0-1.024-.161-1.24-.539-3.988-6.467-1.832-10.994 26.301-28.025 28.187-17.031 47.966-27.271 36.648-39.505-1.24-1.401-3.072-2.048-5.282-2.048-17.138 0-57.505 36.756-57.505 36.756s-10.887 11.318-17.462 11.318a3.99 3.99 0 01-3.665-2.048c-4.689-7.868 43.385-44.301 46.08-59.338 1.832-10.24-1.294-15.36-7.06-15.36z" fill="#FF9D0B"/>
                <path d="M284.945 397.15c-14.821-21.773-13.797-38.103 6.576-58.422 20.318-20.318 32.175-50.122 32.175-50.122s4.419-17.246 14.551-15.629c10.025 1.617 17.408 27.378-3.664 43.169-21.127 15.792 4.203 26.517 12.287 11.696 8.139-14.821 30.343-52.925 41.823-60.255 11.479-7.276 19.617-3.233 16.869 11.857-2.695 15.037-50.769 51.47-46.08 59.284 4.635 7.923 21.127-9.216 21.127-9.216s51.631-46.942 62.841-34.708c11.21 12.234-8.515 22.474-36.649 39.505-28.186 17.031-30.342 21.558-26.408 28.025 4.042 6.468 66.183-45.972 72.003-23.713 5.821 22.15-63.38 28.564-59.122 43.924 4.311 15.36 48.775-28.996 57.883-11.749 9.108 17.3-62.788 37.618-63.38 37.78-23.229 6.036-82.244 18.809-102.832-11.426z" fill="#FFD21E"/>
              </svg>
            </a>
            <a href="https://x.com/jos44711" target="_blank" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a href="mailto:ayandajoseph390@gmail.com" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1">
              <i className="fa-solid fa-envelope"></i>
            </a>
            <a href="https://wa.me/2349019029665" target="_blank" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1">
              <i className="fa-brands fa-whatsapp"></i>
            </a>
          </div>
          <p className="text-text-secondary text-sm">
            &copy; 2026 ayanda joseph. building impactful AI & innovative software.
          </p>
        </div>
      </footer>
    </>
  );
}
