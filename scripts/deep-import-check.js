import fs from "fs";
import path from "path";

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  
  // Check lucide-react
  const lucideMatch = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']lucide-react["']/);
  if (lucideMatch) {
    const imported = new Set(lucideMatch[1].split(",").map(s => s.trim()).filter(Boolean));
    // match JSX tags starting with Capital letters not React/Link etc
    const used = new Set([...content.matchAll(/<([A-Z][a-zA-Z0-9]+)/g)].map(m => m[1]));
    // Check known lucide icons
    for (const tag of used) {
      if (["ArrowRight", "Clock", "MapPin", "Search", "X", "Zap", "TrendingUp", "Bell", "Eye", "User", "Calendar", "Share2", "Bookmark", "Check", "ChevronRight", "ChevronDown", "ChevronLeft", "AlertCircle", "Home", "Mail", "Phone", "Video", "Play", "Menu", "Languages", "CheckCircle2", "ArrowLeft", "Sparkles", "Compass", "Globe", "Newspaper", "Flame", "Layers", "Cpu", "Award", "Trophy"].includes(tag)) {
        if (!imported.has(tag) && !content.includes(`const ${tag}`) && !content.includes(`function ${tag}`) && !content.includes(`import ${tag}`)) {
          console.log(`❌ ${path.basename(filePath)} missing lucide icon: <${tag} />`);
        }
      }
    }
  }

  // Check react-icons/fa
  const faMatch = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']react-icons\/fa["']/);
  if (faMatch) {
    const importedFa = new Set(faMatch[1].split(",").map(s => s.trim()).filter(Boolean));
    const usedFa = new Set([...content.matchAll(/<(Fa[a-zA-Z0-9]+)/g)].map(m => m[1]));
    for (const fa of usedFa) {
      if (!importedFa.has(fa)) {
        console.log(`❌ ${path.basename(filePath)} missing FA icon: <${fa} />`);
      }
    }
  }
}

function scanDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scanDir(full);
    else if (f.endsWith(".jsx")) checkFile(full);
  }
}

scanDir("src");
console.log("Deep scan complete.");
