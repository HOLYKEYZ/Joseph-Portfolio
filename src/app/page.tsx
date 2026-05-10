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
              <a href="https://huggingface.co/josephmayo" target="_blank" className="text-text-secondary hover:text-text-primary text-lg transition-colors">
                <i className="fa-solid fa-face-smile"></i>
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
            {/* Qwopus 9B Unfettered */}
            <div className="bg-card border border-border-subtle rounded-xl p-6 hover:border-accent/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-brain text-accent text-xl"></i>
                  <h3 className="text-lg font-bold text-text-primary">Qwopus 9B Unfettered</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">2k+ downloads</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Uncensored 9B parameter language model. Directional ablation applied to remove refusal mechanisms while maintaining capabilities.
              </p>
              <a 
                href="https://huggingface.co/josephmayo/Qwopus-9B-Unfettered" 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                <i className="fa-solid fa-face-smile"></i> View on HuggingFace
              </a>
            </div>

            {/* Qwopus 9B Unfettered GGUF */}
            <div className="bg-card border border-border-subtle rounded-xl p-6 hover:border-accent/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-brain text-accent text-xl"></i>
                  <h3 className="text-lg font-bold text-text-primary">Qwopus 9B Unfettered GGUF</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">3.16k+ downloads</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Quantized GGUF version of Qwopus 9B Unfettered for efficient local inference with llama.cpp and Ollama.
              </p>
              <a 
                href="https://huggingface.co/josephmayo/Qwopus-9B-Unfettered-GGUF" 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                <i className="fa-solid fa-face-smile"></i> View on HuggingFace
              </a>
            </div>

            {/* Qwen2.5 0.5B Unfettered */}
            <div className="bg-card border border-border-subtle rounded-xl p-6 hover:border-accent/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-brain text-accent text-xl"></i>
                  <h3 className="text-lg font-bold text-text-primary">Qwen2.5 0.5B Unfettered</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">411+ downloads</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Lightweight 0.5B parameter uncensored model based on Qwen2.5. Optimized for edge deployment and resource-constrained environments.
              </p>
              <a 
                href="https://huggingface.co/josephmayo/Qwen2.5-0.5B-Unfettered" 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                <i className="fa-solid fa-face-smile"></i> View on HuggingFace
              </a>
            </div>

            {/* Refusal Compliance Pairs Dataset */}
            <div className="bg-card border border-border-subtle rounded-xl p-6 hover:border-accent/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-database text-accent text-xl"></i>
                  <h3 className="text-lg font-bold text-text-primary">Refusal Compliance Pairs</h3>
                </div>
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">168+ downloads</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Curated dataset of 200+ refusal-compliance prompt pairs for AI safety research and red teaming evaluation.
              </p>
              <a 
                href="https://huggingface.co/datasets/josephmayo/refusal-compliance-pairs" 
                target="_blank"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                <i className="fa-solid fa-face-smile"></i> View on HuggingFace
              </a>
            </div>
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
            <a href="https://huggingface.co/josephmayo" target="_blank" className="text-text-secondary hover:text-text-primary text-2xl transition-all hover:-translate-y-1">
              <i className="fa-solid fa-face-smile"></i>
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
