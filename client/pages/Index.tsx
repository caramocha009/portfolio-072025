import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { DraggableWindow } from "@/components/ui/draggable-window";
import { DesktopIcon } from "@/components/ui/desktop-icon";
import {
  WorksIcon,
  ContactIcon,
  ArticlesIcon,
  AboutIcon,
  PlaylistIcon,
  RecyclingIcon,
  ProductDesignIcon,
  ContentCreationIcon,
} from "@/components/ui/folder-icons";

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface RSSResponse {
  status: string;
  feed: {
    title: string;
    description: string;
  };
  items: MediumArticle[];
}

// Contact Form Component with EmailJS
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // EmailJS configuration - you'll need to set these up in your EmailJS account
      const serviceId = "service_0r519yh"; // Your EmailJS service ID
      const templateId = "template_w4074xf"; // Your EmailJS template ID
      const publicKey = "80xdAjM3fcJqjZ5cv"; // Your EmailJS public key

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: "Cara Liu",
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-black p-6 overflow-y-auto flex flex-col h-full">
      <h3 className="font-bold text-lg sm:text-xl mb-6">Contact Me</h3>

      {submitStatus === "success" && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Thanks for your message! I'll get back to you soon.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Sorry, there was an error sending your message. Please try again or
          email me directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Message Field */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-semibold mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell me about your project or say hello..."
            required
            className="flex-1 w-full px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed"
            style={{ minHeight: "150px" }}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          Or email me directly at{" "}
          <a
            href="mailto:carayuliu@gmail.com"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            carayuliu@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

// Medium Article Embed Component
function MediumArticleEmbed({
  onImageClick,
  articleType = "savvo-sommelier",
}: {
  onImageClick: (src: string) => void;
  articleType?: string;
}) {
  const [articleContent, setArticleContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const fetchMediumArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use RSS2JSON to fetch articles (exact same approach as Savvo)
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@caramocha",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      const data = await response.json();

      let targetArticle;
      if (articleType === "savvo-sommelier") {
        // For Savvo article, try to find it in the feed
        targetArticle = data.items.find(
          (item: any) =>
            item.title.toLowerCase().includes("savvo") ||
            item.title.toLowerCase().includes("digital sommelier"),
        );

        if (targetArticle) {
          setArticleContent(targetArticle);
        } else {
          throw new Error(
            `Savvo article not found. Available articles: ${data.items.map((item: any) => item.title).join(", ")}`,
          );
        }
      } else if (articleType === "hyvee-aisles") {
        // For Hy-Vee article, try to find it in the feed
        targetArticle = data.items.find(
          (item: any) =>
            item.title.toLowerCase().includes("hy-vee") ||
            item.title.toLowerCase().includes("hyvee") ||
            item.title.toLowerCase().includes("aisles") ||
            item.title.toLowerCase().includes("cards, tags, and ads"),
        );

        if (targetArticle) {
          setArticleContent(targetArticle);
        } else {
          throw new Error(
            `Hy-Vee article not found. Available articles: ${data.items.map((item: any) => item.title).join(", ")}`,
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refetchArticle = () => {
    setRefetchKey((prev) => prev + 1);
  };

  useEffect(() => {
    fetchMediumArticle();
  }, [refetchKey, articleType]);

  // Trigger immediate refetch on component mount
  useEffect(() => {
    refetchArticle();
  }, []);

  useEffect(() => {
    // Set up global lightbox handler
    (window as any).openLightbox = (src: string) => {
      onImageClick(src);
    };

    return () => {
      delete (window as any).openLightbox;
    };
  }, [onImageClick]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-black font-mono">Loading article...</p>
      </div>
    );
  }

  if (error || !articleContent) {
    return (
      <div className="text-center py-8">
        <p className="text-black font-mono mb-4">
          Unable to load article content
        </p>
        <a
          href={
            articleType === "hyvee-aisles"
              ? "https://medium.com/@caramocha/cards-tags-and-ads-ux-for-online-shopping-experience-10b577148105"
              : "https://medium.com/@caramocha/ux-case-study-savvo-digital-sommelier-c2da6957105d"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-orange-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-base font-bold"
        >
          ��� Read on Medium →
        </a>
      </div>
    );
  }

  // Extract first image from content
  const extractFirstImage = (content: string) => {
    const firstImageMatch = content.match(/<img[^>]*>/);
    if (firstImageMatch) {
      const srcMatch = firstImageMatch[0].match(/src="([^"]*)"/);
      if (srcMatch) {
        const firstImage = `<img src="${srcMatch[1]}" onclick="window.openLightbox('${srcMatch[1]}')" style="cursor: pointer; width: 100%; height: auto; margin: 0 auto 48px auto; display: block; max-width: 782px;">`;
        const contentWithoutFirstImage = content.replace(/<img[^>]*>/, "");
        return { firstImage, remainingContent: contentWithoutFirstImage };
      }
    }
    return { firstImage: "", remainingContent: content };
  };

  const { firstImage, remainingContent } = extractFirstImage(
    articleContent.content || articleContent.description || "",
  );

  return (
    <>
      <article className="text-black max-w-4xl mx-auto">
        {/* First Image */}
        {firstImage && (
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto 48px auto",
              display: "flex",
              justifyContent: "center",
            }}
            dangerouslySetInnerHTML={{ __html: firstImage }}
          />
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: "42px",
            fontWeight: "800",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            color: "#242424",
            maxWidth: "680px",
            margin: "0 auto 24px auto",
            textAlign: "left",
          }}
        >
          Savvo Digital Sommelier
        </h1>

        {/* Subtitle */}
        <h2
          style={{
            fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: "22px",
            fontWeight: "400",
            lineHeight: "1.4",
            letterSpacing: "-0.01em",
            color: "#6B6B6B",
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          A study in user research and contextual inquiry.
        </h2>

        <div
          className="medium-article-content"
          style={{
            fontFamily: 'Georgia, Charter, "Times New Roman", serif',
            fontSize: "21px",
            lineHeight: "1.58",
            color: "#292929",
            marginTop: "-126px",
          }}
          dangerouslySetInnerHTML={{
            __html: (() => {
              if (!remainingContent) return "";

              // Split into parts and remove the last img tag
              const parts = remainingContent.split(/(<img[^>]*>)/);
              let lastImgIndex = -1;

              // Find the last img tag
              for (let i = parts.length - 1; i >= 0; i--) {
                if (parts[i] && parts[i].match(/<img[^>]*>/)) {
                  lastImgIndex = i;
                  break;
                }
              }

              // Remove the last img tag if found
              if (lastImgIndex !== -1) {
                parts.splice(lastImgIndex, 1);
              }

              let processedContent = parts
                .join("")
                .replace(/<h1[^>]*>.*?<\/h1>/i, "") // Completely remove the original title
                .replace(/<h3[^>]*>\[UX Case Study\][^<]*<\/h3>/i, "") // Remove UX Case Study heading
                .replace(/\s*<\/p>\s*$/, "</p>") // Clean up trailing whitespace
                .replace(/(<\/[^>]+>)\s*(<\/[^>]+>)/g, "$1$2") // Remove spaces between closing tags
                .replace(
                  /<img([^>]*?)src="([^"]*)"([^>]*?)>/g,
                  '<img$1src="$2"$3>',
                ) // Keep images as-is
                .replace(
                  /Project Brief/gi,
                  '<h3 style="font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0; color: #242424; font-family: sohne, Helvetica Neue, Helvetica, Arial, sans-serif;">Project Brief</h3>',
                ) // Style Project Brief like The Challenge
                .replace(/<h[23][^>]*>[^<]*challenge[^<]*<\/h[23]>/gi, ""); // Remove The Challenge headings

              return processedContent;
            })(),
          }}
        />
      </article>
    </>
  );
}

interface WindowConfig {
  id: string;
  content: React.ReactNode;
  backgroundColor: string;
  headerColor: string;
  initialX: number;
  initialY: number;
  width?: number;
  height?: number;
  zIndex: number;
}

// Case Study Navigation Component
function CaseStudyNavigation({ isVisible }: { isVisible: boolean }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [sections, setSections] = useState<
    Array<{ id: string; title: string }>
  >([]);

  useEffect(() => {
    if (!isVisible) return;

    // Extract sections from the article content
    const extractSections = () => {
      const sectionList: Array<{ id: string; title: string }> = [];

      // Check if we're in the Ascent Global Logistics case study
      const ascentHeading = document.querySelector("#interactive-case-study");
      if (ascentHeading) {
        // For Ascent case study, use predefined sections
        sectionList.push({
          id: "interactive-case-study",
          title: "Interactive Case Study",
        });
        sectionList.push({ id: "view-prototype", title: "View Prototype" });
        setSections(sectionList);
        return;
      }

      // Check if we're in the Hy-Vee case study
      const hyveeTitle = document.querySelector("h1")?.textContent;
      if (hyveeTitle && hyveeTitle.includes("Hy-Vee Aisles Online")) {
        // For Hy-Vee case study, create static navigation and find/add IDs to headings
        const headingMap = [
          {
            searchText: "Online Shopping Experience",
            id: "hyvee-online-shopping-experience",
            title: "Intro",
          },
          {
            searchText: "The Scope Revelation",
            id: "the-scope-revelation",
            title: "The Scope",
          },
          {
            searchText: "Current State",
            id: "understanding-current-state",
            title: "Current State",
          },
          {
            searchText: "The Brand Color Constraint",
            id: "brand-color-constraint",
            title: "Brand Color Constraint",
          },
          {
            searchText: "Information Architecture Redesign",
            id: "information-architecture-redesign",
            title: "Visual Hierarchy",
          },
          {
            searchText: "Technical Implementation with Storybook",
            id: "technical-implementation-storybook",
            title: "Technical Implementation",
          },
          {
            searchText: "User Testing for Product Tags",
            id: "user-testing-product-tags",
            title: "Product Tags Testing",
          },
          {
            searchText: "Ads Strategy",
            id: "ads-strategy",
            title: "Ads Strategy",
          },
          {
            searchText: "The Advertising Strategy Challenge",
            id: "advertising-strategy-challenge",
            title: "Ads Placement Testing",
          },
          {
            searchText: "Large-Scale User Testing",
            id: "large-scale-user-testing",
            title: "Large-Scale User Testing",
          },
          {
            searchText: "Project Reflections",
            id: "project-reflections",
            title: "Reflections",
          },
          {
            searchText: "Project Outcomes",
            id: "project-outcomes",
            title: "Outcomes",
          },
        ];

        // Always show all navigation items
        headingMap.forEach((mapping) => {
          sectionList.push({ id: mapping.id, title: mapping.title });
        });

        // Try to find and add IDs to actual headings in the background
        setTimeout(() => {
          const allHeadings = document.querySelectorAll(
            ".medium-article-content h2, .medium-article-content h3, .medium-article-content h4",
          );

          headingMap.forEach((mapping) => {
            allHeadings.forEach((heading) => {
              const headingText =
                heading.textContent?.trim().toLowerCase() || "";
              const searchText = mapping.searchText.toLowerCase();

              // Split search text into words for more flexible matching
              const searchWords = searchText
                .split(" ")
                .filter((word) => word.length > 2);
              const matchingWords = searchWords.filter((word) =>
                headingText.includes(word),
              );
              const isPartialMatch =
                matchingWords.length >= Math.ceil(searchWords.length * 0.6);

              if (
                headingText.includes(searchText) ||
                searchText.includes(headingText) ||
                (headingText.includes("understanding") &&
                  headingText.includes("current state") &&
                  searchText.includes("current state")) ||
                (headingText.includes("user testing") &&
                  headingText.includes("product tags") &&
                  searchText.includes("user testing") &&
                  searchText.includes("product tags") &&
                  !searchText.includes("large-scale") &&
                  !headingText.includes("large-scale")) ||
                (headingText.includes("large-scale") &&
                  headingText.includes("user testing") &&
                  searchText.includes("large-scale") &&
                  searchText.includes("user testing"))
              ) {
                heading.setAttribute("id", mapping.id);
                console.log(
                  `Added ID "${mapping.id}" to heading: "${heading.textContent}"`,
                );
              }
            });
          });
        }, 1000);

        setSections(sectionList);
        return;
      }

      // Find and mark Project Brief section based on actual content
      const findProjectBriefLocation = () => {
        // Look for text containing "project brief" or similar patterns
        const allTextElements = document.querySelectorAll(
          ".medium-article-content *",
        );
        for (const element of allTextElements) {
          const text = element.textContent?.toLowerCase() || "";
          if (
            text.includes("project brief") ||
            text.includes("project overview")
          ) {
            // Create a marker element right before this content
            const marker = document.createElement("div");
            marker.id = "project-brief";
            marker.style.position = "absolute";
            marker.style.top = "-100px"; // Offset for better scroll positioning
            element.parentNode?.insertBefore(marker, element);
            return true;
          }
        }

        // Fallback: use the subtitle if no specific "project brief" text found
        const subtitle = document.querySelector('h2[style*="font-size: 22px"]');
        if (subtitle && !subtitle.id) {
          subtitle.setAttribute("id", "project-brief");
          return true;
        }
        return false;
      };

      if (findProjectBriefLocation()) {
        sectionList.push({ id: "project-brief", title: "Project Brief" });
      }

      // Add other sections from headings in the content, excluding "The Challenge"
      const headings = document.querySelectorAll(
        ".medium-article-content h2, .medium-article-content h3",
      );

      headings.forEach((heading, index) => {
        const text = heading.textContent?.trim() || "";
        if (
          text &&
          text !== "Project Brief" &&
          !text.toLowerCase().includes("challenge")
        ) {
          const id = `section-${index + 1}`;
          heading.setAttribute("id", id);
          sectionList.push({ id, title: text });
        } else if (text.toLowerCase().includes("challenge")) {
          // Hide The Challenge heading since we're merging it with Project Brief
          heading.style.display = "none";
        }
      });

      console.log("Extracted sections:", sectionList); // Debug log
      setSections(sectionList);
    };

    // Track active section based on scroll position
    const handleScroll = () => {
      const container = document.querySelector("[data-case-study-container]");
      if (!container) return;

      const allSections = document.querySelectorAll(
        '#project-brief, [id^="section-"], #interactive-case-study, #view-prototype, #hyvee-online-shopping-experience, #the-scope-revelation, #understanding-current-state, #brand-color-constraint, #information-architecture-redesign, #technical-implementation-storybook, #user-testing-product-tags, #ads-strategy, #advertising-strategy-challenge, #large-scale-user-testing, #project-reflections, #project-outcomes',
      );
      let current = "";
      const containerRect = container.getBoundingClientRect();
      const scrollTop = container.scrollTop;

      // Find the section that's currently in view
      let closestSection = null;
      let closestDistance = Infinity;

      allSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;

        // Section is in view if it's within the viewport area
        if (relativeTop <= 250 && relativeTop >= -500) {
          const distance = Math.abs(relativeTop - 150); // Target 150px from top
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        }
      });

      if (closestSection) {
        current = closestSection.getAttribute("id") || "";
      } else if (scrollTop < 200) {
        // Only default to project-brief if we're near the very top and no other section is found
        const projectBrief = document.getElementById("project-brief");
        if (projectBrief) {
          current = "project-brief";
        }
      }

      if (current && current !== activeSection) {
        console.log("Active section changed to:", current); // Debug log
        setActiveSection(current);
      }
    };

    // Add delay to ensure content is loaded
    const timer = setTimeout(() => {
      extractSections();
      handleScroll(); // Initial check
    }, 500);

    // Use the case study container for scroll events instead of window
    const container = document.querySelector("[data-case-study-container]");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isVisible]);

  if (!isVisible || sections.length === 0) return null;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const container = document.querySelector("[data-case-study-container]");
      if (container) {
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const targetPosition =
          scrollTop + elementRect.top - containerRect.top - 100; // 100px spacing from top

        container.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="fixed left-8 top-1/2 transform -translate-y-1/2 z-[9998] bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-[200px]">
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left w-full text-sm font-mono transition-all hover:text-black py-1 ${
                activeSection === section.id
                  ? "text-black font-bold border-l-3 border-blue-500 pl-3 bg-blue-50"
                  : "text-gray-600 pl-2 hover:pl-3 hover:border-l-2 hover:border-gray-300"
              }`}
            >
              {section.title.substring(0, 35)}
              {section.title.length > 30 ? "..." : ""}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Lightbox Component
function Lightbox({
  imageSrc,
  onClose,
}: {
  imageSrc: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[10000] cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <img
          src={imageSrc}
          alt="Enlarged image"
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
        >
          ��
        </button>
      </div>
    </div>
  );
}

export default function Index() {
  const [showRecyclingTooltip, setShowRecyclingTooltip] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [asciiArtColor, setAsciiArtColor] = useState("#ffffff");

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [openWindows, setOpenWindows] = useState<WindowConfig[]>([
    {
      id: "sticky1",
      backgroundColor: "#F2B973",
      headerColor: "#E68C4F",
      initialX: window.innerWidth
        ? Math.max(50, window.innerWidth / 2 - 350)
        : 350,
      initialY: window.innerHeight
        ? Math.max(50, window.innerHeight / 2 - 150)
        : 250,
      zIndex: 10,
      content: (
        <div className="flex items-center h-full">
          <p className="text-black text-base leading-6">
            Hey! I'm <strong>Cara</strong>—your friendly neighborhood{" "}
            <u>product designer</u> & <u>content creator</u>. For{" "}
            <strong>8+ years</strong>, I've helped people turn early ideas into
            thoughtful products, beautiful visuals, and scroll-stopping stories.
            <br />
            <br />
            <i>What vision can we bring to life together?</i>
          </p>
        </div>
      ),
    },
    {
      id: "sticky2",
      backgroundColor: "#F0A7CC",
      headerColor: "#E68AA8",
      initialX: window.innerWidth
        ? Math.max(370, window.innerWidth / 2 + 30)
        : 670,
      initialY: window.innerHeight
        ? Math.max(50, window.innerHeight / 2 - 150)
        : 250,
      zIndex: 11,
      content: (
        <div className="flex items-center justify-center h-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F004bc9981e154e2e9b9ede829f9f12cc?format=webp&width=800"
            alt="Inspirational quote about freedom and living in the moment"
            className="max-w-full max-h-full object-contain"
            style={{ transform: "scale(1.75) translateY(4px)" }}
          />
        </div>
      ),
    },
  ]);

  const [nextZIndex, setNextZIndex] = useState(20);
  const [isProjectsFullscreenOpen, setIsProjectsFullscreenOpen] =
    useState(false);
  const [currentFullscreenType, setCurrentFullscreenType] = useState<
    string | null
  >(null);
  const [currentCaseStudy, setCurrentCaseStudy] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [persistentHoveredProject, setPersistentHoveredProject] = useState<
    string | null
  >(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const projectsListRef = useRef<HTMLDivElement>(null);

  // Handle URL-based case study navigation
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;

      if (pathname === "" || pathname === "/") {
        setCurrentCaseStudy(null);
        setIsProjectsFullscreenOpen(false);
        setCurrentFullscreenType(null);
      } else if (pathname === "/projects/product-design") {
        setIsProjectsFullscreenOpen(true);
        setCurrentFullscreenType("Product Design");
        setCurrentCaseStudy(null);
      } else if (pathname === "/projects/content-creation") {
        setIsProjectsFullscreenOpen(true);
        setCurrentFullscreenType("Content Creation");
        setCurrentCaseStudy(null);
      } else if (pathname.startsWith("/projects/")) {
        const caseStudyId = pathname.replace("/projects/", "");
        if (caseStudyId) {
          setCurrentCaseStudy(caseStudyId);
          setIsProjectsFullscreenOpen(true);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Check initial URL on mount
    const pathname = window.location.pathname;
    if (pathname === "/projects/product-design") {
      setIsProjectsFullscreenOpen(true);
      setCurrentFullscreenType("Product Design");
    } else if (pathname === "/projects/content-creation") {
      setIsProjectsFullscreenOpen(true);
      setCurrentFullscreenType("Content Creation");
    } else if (
      pathname &&
      pathname !== "/" &&
      pathname.startsWith("/projects/")
    ) {
      const caseStudyId = pathname.replace("/projects/", "");
      if (caseStudyId) {
        setCurrentCaseStudy(caseStudyId);
        setIsProjectsFullscreenOpen(true);
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL when case study or fullscreen type changes
  useEffect(() => {
    if (currentCaseStudy) {
      window.history.pushState(
        { caseStudy: currentCaseStudy },
        `${currentCaseStudy}`,
        `/projects/${currentCaseStudy}`,
      );
    } else if (currentFullscreenType === "Product Design") {
      window.history.pushState(
        { fullscreenType: "Product Design" },
        "Product Design",
        "/projects/product-design",
      );
    } else if (currentFullscreenType === "Content Creation") {
      window.history.pushState(
        { fullscreenType: "Content Creation" },
        "Content Creation",
        "/projects/content-creation",
      );
    } else {
      window.history.pushState({}, "Home", "/");
    }
  }, [currentCaseStudy, currentFullscreenType]);

  useEffect(() => {
    if (currentCaseStudy) {
      const container = document.querySelector("[data-case-study-container]");
      if (container) {
        const handleScroll = () => {
          const scrollTop = container.scrollTop;
          const scrollHeight = container.scrollHeight - container.clientHeight;
          const progress = (scrollTop / scrollHeight) * 100;
          setScrollProgress(Math.min(100, Math.max(0, progress)));

          // Show navigation when scrolled past the title section (approximately 300px)
          setShowNavigation(scrollTop > 300);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
      }
    } else {
      setShowNavigation(false);
    }
  }, [currentCaseStudy]);

  // Reset scroll position when returning to projects view
  useEffect(() => {
    if (
      !currentCaseStudy &&
      isProjectsFullscreenOpen &&
      projectsListRef.current
    ) {
      // Reset scroll to top
      projectsListRef.current.scrollTop = 0;
    }
  }, [currentCaseStudy, isProjectsFullscreenOpen]);

  // State for Medium article content
  const [mediumArticle, setMediumArticle] = useState(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [articleError, setArticleError] = useState(null);

  // Fetch full Medium article content for Hy-Vee case study
  useEffect(() => {
    if (currentCaseStudy === "hyvee-aisles") {
      // Set up global lightbox handler for Hy-Vee case study
      (window as any).openLightbox = (src: string) => {
        setLightboxImage(src);
      };

      setIsLoadingArticle(true);
      setArticleError(null);

      // Use RSS2JSON to fetch the specific Medium article
      const rssUrl = "https://medium.com/feed/@caramocha";
      const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "ok") {
            // Find the specific article by ID or title
            const targetArticle = data.items.find(
              (item) =>
                item.link.includes("10b577148105") ||
                item.title.toLowerCase().includes("cards, tags, and ads") ||
                item.title.toLowerCase().includes("cards tags and ads"),
            );

            if (targetArticle) {
              setMediumArticle(targetArticle);
            } else {
              setArticleError("Article not found");
            }
          } else {
            setArticleError("Failed to fetch articles");
          }
        })
        .catch((error) => {
          console.error("Error fetching Medium article:", error);
          setArticleError("Failed to load article");
        })
        .finally(() => {
          setIsLoadingArticle(false);
        });
    }
  }, [currentCaseStudy]);

  // Load Instagram embed script globally
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Process Instagram embeds when they appear
  useEffect(() => {
    if ((window as any).instgrm && (window as any).instgrm.Embeds) {
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  const bringToFront = (windowId: string) => {
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === windowId ? { ...window, zIndex: nextZIndex } : window,
      ),
    );
    setNextZIndex((prev) => prev + 1);
  };

  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
  };

  const openNewWindow = (type: string) => {
    // Check if a window of this type already exists
    const existingWindow = openWindows.find((window) =>
      window.id.startsWith(type),
    );
    if (existingWindow) {
      // Bring existing window to front instead of creating duplicate
      bringToFront(existingWindow.id);
      return;
    }

    if (
      type === "Projects" ||
      type === "Product Design" ||
      type === "Content Creation"
    ) {
      setIsProjectsFullscreenOpen(true);
      setCurrentFullscreenType(type);
      return;
    }

    let windowContent;
    let bgColor = "#78B8F1";
    let headerColor = "#5088BA";

    if (type === "Articles") {
      bgColor = "#FFFFFF";
      headerColor = "#FFFFFF";
      windowContent = (
        <div className="bg-white h-full overflow-y-auto">
          {/* Article 1 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fcaaef5fe4be442b7aafe8dfdaf76973a?format=webp&width=800"
              alt="Article thumbnail"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Cyan Banister — From Homeless and Broke to Top Angel Investo...
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  A
                </div>
                <span className="truncate">Tim</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">Tim Ferriss</span>
              </div>
            </div>
          </div>

          {/* Article 2 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fcaaef5fe4be442b7aafe8dfdaf76973a?format=webp&width=800"
              alt="Article thumbnail"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Cyan Banister, Arielle Zuckerberg Raise $181 Million to Back...
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  B
                </div>
                <span className="truncate">Bloomberg</span>
                <span className="flex-shrink-0">��</span>
                <span className="truncate">Lizette Chapman</span>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">
                VB
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Zivity founder finally takes it all off
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <span className="text-red-600 font-bold flex-shrink-0">VB</span>
                <span className="truncate">VentureBeat</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">Paul Boutin</span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (type === "About") {
      bgColor = "#FFFFFF";
      headerColor = "#FFFFFF";
      windowContent = (
        <div className="text-black px-6 pt-6 pb-6 overflow-y-auto">
          <div className="flex gap-6 items-start justify-center">
            <div className="flex-shrink-0 space-y-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fda52f87e0d074ad1b1f0d2323587ad30?format=webp&width=800"
                alt="Cara Liu"
                className="w-52 h-52 object-cover rounded-lg"
              />

              {/* Turtle Story Container */}
              <div className="px-4 pt-4 pb-4 border-2 border-gray-300 rounded-lg bg-gray-50 w-52">
                <h5
                  className="text-xs font-semibold -mt-4 flex items-center gap-1"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  What's with the turtle?
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F06b8f3812aef472ba6f2dbbdc9c5f523?format=webp&width=800"
                    alt="Logo"
                    className="w-16 h-16 object-contain"
                  />
                </h5>
                <p className="text-xs leading-relaxed text-gray-700 mb-0">
                  I once viewed my deliberate pace as a limitation, but it's
                  become my biggest creative strength. Like a turtle, I move
                  methodically—diving deep into the heart of a story or a
                  problem, noticing nuances others might overlook, and
                  communicating with intention and clarity. My approach isn't
                  slow; it's strategic.
                </p>
              </div>
            </div>
            <div className="flex-1 text-sm sm:text-base leading-relaxed space-y-4">
              <h4
                className="text-lg font-semibold mb-4"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                Meet Cara Liu — a Storyteller & Designer Who Cares
              </h4>
              <p>
                I'm a product designer and content creator who loves working in
                the gentle chaos where meaning, emotion, and creativity overlap.
                Whether I'm designing intuitive user experiences or editing
                videos that make people feel something, my work always comes
                back to one core question:
              </p>
              <p>
                <strong>
                  Does this actually land with the person on the other side?
                </strong>
              </p>
              <p>
                I'm less concerned about chasing perfect metrics and more
                focused on clarity, resonance, and impact. In design, that means
                uncovering the real user problem and crafting solutions that
                feel effortless and human. In content, that means shaping
                long-form YouTube videos, podcast conversations, or short-form
                social content in a way that tells a true, emotionally grounded
                story.
              </p>
              <p>
                I'm especially drawn to themes of spirituality,
                self-development, and mindful living—but at the end of the day,
                I just love helping people express what matters to them, whether
                through an interface or a frame on a timeline.
              </p>
              <p>
                I'm comfortable in the "messy middle" of the creative process:
                The place where ideas are half-formed, where pixels or words are
                close-but-not-quite, and where patience is required for a
                story—or a design solution—to reveal itself.
              </p>
              <p>
                <strong>
                  Do you have a story to tell or a product to bring to life?
                </strong>
                <br />
                Let's connect.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (type === "Contact") {
      bgColor = "#FFFFFF";
      headerColor = "#FFFFFF";
      windowContent = <ContactForm />;
    } else {
      bgColor = "#FFFFFF";
      headerColor = "#FFFFFF";
      windowContent = (
        <div className="text-black p-4">
          <h3 className="font-bold text-lg sm:text-xl mb-4 truncate">{type}</h3>
          <p className="text-sm sm:text-base leading-relaxed">
            This is a placeholder window for {type}. More content coming soon!
          </p>
        </div>
      );
    }

    const newWindow: WindowConfig = {
      id: `${type}-${Date.now()}`,
      backgroundColor: bgColor,
      headerColor: headerColor,
      initialX:
        type === "About"
          ? window.innerWidth < 1024
            ? Math.max(
                0,
                (window.innerWidth - Math.min(window.innerWidth - 40, 720)) / 2,
              )
            : (window.innerWidth - 720) / 2
          : type === "Contact"
            ? window.innerWidth < 1024
              ? 0
              : (window.innerWidth - 600) / 2
            : Math.random() * 200 + 100,
      initialY:
        type === "About"
          ? (window.innerHeight - (window.innerHeight - 48)) / 2
          : type === "Contact"
            ? window.innerWidth < 1024
              ? 0
              : (window.innerHeight - 632) / 2
            : Math.random() * 200 + 100,
      width:
        type === "Articles"
          ? window.innerWidth < 1024
            ? Math.min(window.innerWidth - 40, 500)
            : 500
          : type === "About"
            ? window.innerWidth < 1024
              ? Math.min(window.innerWidth - 40, 720)
              : 720
            : type === "Contact"
              ? window.innerWidth < 1024
                ? window.innerWidth
                : 600
              : window.innerWidth < 1024
                ? Math.min(window.innerWidth - 40, 300)
                : 300,
      height:
        type === "Articles"
          ? window.innerWidth < 1024
            ? Math.min(window.innerHeight - 80, 400)
            : 400
          : type === "About"
            ? window.innerHeight - 48
            : type === "Contact"
              ? window.innerWidth < 1024
                ? window.innerHeight
                : 632
              : window.innerWidth < 1024
                ? Math.min(window.innerHeight - 80, 300)
                : 300,
      zIndex: nextZIndex,
      content: windowContent,
    };
    setOpenWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  return (
    <>
      {/* Fullscreen Projects Window */}
      {isProjectsFullscreenOpen && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
          {/* Breadcrumb Header */}
          <div className="border-b-2 border-black bg-white sticky top-0 z-[10000] shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              {/* Desktop Breadcrumbs */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => setIsProjectsFullscreenOpen(false)}
                  className="text-black font-mono text-sm hover:opacity-70 transition-opacity cursor-pointer"
                >
                  🏠 Home
                </button>
                <span className="text-black font-mono text-sm">→</span>
                <span className="text-black font-mono text-sm">
                  {currentFullscreenType === "Product Design"
                    ? "📂 Product Design"
                    : currentFullscreenType === "Content Creation"
                      ? "📂 Content Creation"
                      : "📂 Projects"}
                </span>
              </div>

              {/* Mobile Breadcrumb */}
              <div className="lg:hidden">
                <span className="text-black font-mono text-sm font-bold">
                  {currentFullscreenType === "Product Design"
                    ? "Product Design"
                    : currentFullscreenType === "Content Creation"
                      ? "Content Creation"
                      : "Projects"}
                </span>
              </div>

              {/* Back Button */}
              <button
                onClick={() => setIsProjectsFullscreenOpen(false)}
                className="px-3 py-1 bg-gray-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-xs"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Projects List - Full Width */}
            <div
              ref={projectsListRef}
              className="w-full bg-white overflow-y-auto overflow-x-hidden"
            >
              {/* Projects Grid Layout */}
              <div className="max-w-6xl mx-auto p-6">
                {/* Content Creation & Video Editing Section */}
                {(currentFullscreenType === "Content Creation" ||
                  currentFullscreenType === null) && (
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                      <h2
                        className="text-2xl font-bold text-black"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        {currentFullscreenType === "Content Creation"
                          ? "Content Creation"
                          : "Content Creation & Video Editing"}
                      </h2>
                      {currentFullscreenType === "Content Creation" && (
                        <a
                          href="https://drive.google.com/file/d/1B405jnP-szDIfLJAs-ETUbb9Y7HK1Yw1/view?usp=drive_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border border-purple-700 rounded font-mono font-bold text-sm transition-colors"
                        >
                          📄 View Resume
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-full">
                      {/* Demo Reel Video */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() => setCurrentCaseStudy("youtube-demo-reel")}
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://img.youtube.com/vi/phxDaMSYldc/maxresdefault.jpg"
                          alt="Demo Reel"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Video Editing Demo Reel
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Video
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              demo reel, videoboost, sfx
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bali Women's Retreat */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onMouseEnter={
                          isDesktop
                            ? () => {
                                setHoveredProject("bali-retreat");
                                setPersistentHoveredProject("bali-retreat");
                              }
                            : undefined
                        }
                        onMouseLeave={
                          isDesktop
                            ? () => {
                                setHoveredProject(null);
                              }
                            : undefined
                        }
                        onClick={() => setCurrentCaseStudy("bali-retreat")}
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fedeb3d0e747d4650960899471ebbe203?format=webp&width=800"
                          alt="Bali Women's Retreat"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Bali Women's Retreat
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Shorts
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              Instagram, Wellness, Travel
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* YouTube Shorts Video */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() =>
                          setCurrentCaseStudy("youtube-josiah-schneider")
                        }
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://img.youtube.com/vi/jMIY3JhZibU/maxresdefault.jpg"
                          alt="YouTube Video"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Target Guy
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Shorts
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              Skit, Comedy, Client
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Holding Court Method IG Reel */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() =>
                          setCurrentCaseStudy("instagram-holding-court")
                        }
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2Fb2a4ec28b99242d89027eaf43e364ba8?format=webp&width=800"
                          alt="Holding Court Method"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Holding Court Method
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Shorts, IG Reel
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              self-help, CapCut, vfx
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Zen Monk Podcast Episode */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() =>
                          setCurrentCaseStudy("youtube-zen-monk-podcast")
                        }
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://img.youtube.com/vi/Pys3JqhSejE/maxresdefault.jpg"
                          alt="Podcast Episode with Zen Monk Daishin Eric McCabe"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Podcast Episode with Zen Monk Daishin Eric McCabe
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              podcast, YouTube
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              spirituality, interview
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pho Short Film */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() => setCurrentCaseStudy("youtube-pho-short")}
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://img.youtube.com/vi/XAog5HHTw3o/maxresdefault.jpg"
                          alt="Pho"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Pho
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Short film, YouTube
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              creative short, storytelling
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Videoboost Ad */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() =>
                          setCurrentCaseStudy("youtube-videoboost-ad")
                        }
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://img.youtube.com/vi/Tgxs4sNVqYc/maxresdefault.jpg"
                          alt="Videoboost Ad"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Videoboost Ad
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Ad
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              short, ad
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Food Taste Test Teaser IG Reel */}
                      <div
                        className="w-full max-w-sm rounded-lg overflow-hidden cursor-pointer group relative bg-gray-100"
                        style={{ aspectRatio: "1 / 1" }}
                        onClick={() =>
                          setCurrentCaseStudy("instagram-food-teaser")
                        }
                      >
                        {/* Video Thumbnail Image */}
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F5123f6e2c00a4fa3bfb9c2f1d5dd5b0a?format=webp&width=800"
                          alt="Teaser for Food Taste Test Video"
                          className="w-full h-full object-cover"
                        />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 shadow-lg">
                            <svg
                              className="w-8 h-8 text-black ml-0.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Teaser for Food Taste Test Video
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Promo shorts
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              food, vfx
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UX/Product Design Section */}
                {(currentFullscreenType === "Product Design" ||
                  currentFullscreenType === null) && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2
                        className="text-2xl font-bold text-black"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                      >
                        UX/Product Design
                      </h2>
                      {currentFullscreenType === "Product Design" && (
                        <a
                          href="https://docs.google.com/document/d/1fbx3mZPYre4CYOj608mnWDs98uamXAh0/edit?usp=drive_link&ouid=105779629323639375141&rtpof=true&sd=true"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white border border-purple-700 rounded font-mono font-bold text-sm transition-colors"
                        >
                          📄 View Resume
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center max-w-full">
                      {/* Savvo Digital Sommelier */}
                      <div
                        className="w-full max-w-sm aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                        onMouseEnter={
                          isDesktop
                            ? () => {
                                setHoveredProject("savvo-sommelier");
                                setPersistentHoveredProject(null);
                              }
                            : undefined
                        }
                        onMouseLeave={
                          isDesktop ? () => setHoveredProject(null) : undefined
                        }
                        onClick={() => setCurrentCaseStudy("savvo-sommelier")}
                      >
                        {/* Project Image */}
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F25b4f8410215451ba744a09577b540b7?format=webp&width=800"
                          alt="Savvo Digital Sommelier"
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Savvo Digital Sommelier
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Retail
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              UX, UI, Field Study, Persona, Wireframes
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Hy-Vee Aisles Online */}
                      <div
                        className="w-full max-w-sm aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                        onMouseEnter={
                          isDesktop
                            ? () => {
                                setHoveredProject("hyvee-aisles");
                                setPersistentHoveredProject(null);
                              }
                            : undefined
                        }
                        onMouseLeave={
                          isDesktop ? () => setHoveredProject(null) : undefined
                        }
                        onClick={() => setCurrentCaseStudy("hyvee-aisles")}
                      >
                        {/* Project Image */}
                        <img
                          src="https://cdn-images-1.medium.com/max/1024/1*b_l9Ra5rwirDPE4cD_sxvg.jpeg"
                          alt="Hy-Vee Aisles Online"
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Hy-Vee Aisles Online
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              E-commerce
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              Visual Hierarchy, User Testing
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ascent Global Logistics */}
                      <div
                        className="w-full max-w-sm aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group relative"
                        onMouseEnter={
                          isDesktop
                            ? () => {
                                setHoveredProject("ascent-logistics");
                                setPersistentHoveredProject(null);
                              }
                            : undefined
                        }
                        onMouseLeave={
                          isDesktop ? () => setHoveredProject(null) : undefined
                        }
                        onClick={() => setCurrentCaseStudy("ascent-logistics")}
                      >
                        {/* Project Image */}
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F6ad6a790f608497086bac5dc426eeddb?format=webp&width=800"
                          alt="Ascent Global Logistics"
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex flex-col items-center justify-center p-4 rounded-lg">
                          <div className="hidden group-hover:flex flex-col items-center gap-3 text-white">
                            <h3 className="text-lg font-bold text-center">
                              Ascent Global Logistics
                            </h3>
                            <p className="text-sm text-center text-gray-200">
                              Logistics
                            </p>
                            <p className="text-xs text-center text-gray-300">
                              User Interviews, Cross-Functional Collab, Hi-Fi
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PDF Portfolio Download */}
                      <div
                        className="w-full max-w-sm aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden cursor-pointer group relative border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        onClick={() =>
                          window.open(
                            "https://drive.google.com/file/d/1a0TLRRRWCdia_SzjcJjvOFQd9uVM5iuZ/view?usp=sharing",
                            "_blank",
                          )
                        }
                      >
                        {/* Content */}
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center group-hover:bg-blue-50 transition-colors">
                          <div className="text-5xl mb-4">📄</div>
                          <h3 className="text-lg font-bold text-black mb-2">
                            PDF Portfolio
                          </h3>
                          <p className="text-sm text-gray-700">
                            Looking for more in-depth case studies?
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            Click to download
                          </p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-200 flex items-center justify-center">
                          <div className="hidden group-hover:flex flex-col items-center justify-center text-center text-white">
                            <div className="text-4xl mb-2">↓</div>
                            <p className="font-bold">Download PDF</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Study View */}
      {currentCaseStudy && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto"
          data-case-study-container
          style={{
            backgroundColor: "#fafafa",
          }}
        >
          {/* Header with Breadcrumbs - Retro Style */}
          <div className="bg-white sticky top-0 z-[10000]">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              {/* Desktop Breadcrumbs */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentCaseStudy) {
                      setCurrentCaseStudy(null);
                    } else {
                      setIsProjectsFullscreenOpen(false);
                      setCurrentFullscreenType(null);
                    }
                  }}
                  className="text-black font-mono text-sm hover:opacity-70 transition-opacity cursor-pointer"
                >
                  🏠 Home
                </button>
                <span className="text-black font-mono text-sm">→</span>
                <button
                  onClick={() => {
                    setCurrentCaseStudy(null);
                    setIsProjectsFullscreenOpen(true);
                  }}
                  className="text-black font-mono text-sm hover:opacity-70 transition-opacity cursor-pointer"
                >
                  📂 Projects
                </button>
                <span className="text-black font-mono text-sm">→</span>
                <span className="text-black font-mono text-sm">
                  {currentCaseStudy === "savvo-sommelier"
                    ? "Savvo Digital Sommelier"
                    : currentCaseStudy === "hyvee-aisles"
                      ? "Hy-Vee Aisles Online"
                      : currentCaseStudy === "ascent-logistics"
                        ? "Ascent Global Logistics"
                        : currentCaseStudy === "bali-retreat"
                          ? "Bali Women's Retreat"
                          : currentCaseStudy === "youtube-josiah-schneider"
                            ? "Target Guy"
                            : currentCaseStudy === "youtube-demo-reel"
                              ? "Video Editing Demo Reel"
                              : currentCaseStudy === "instagram-holding-court"
                                ? "Holding Court Method"
                                : currentCaseStudy ===
                                    "youtube-zen-monk-podcast"
                                  ? "Podcast Episode with Zen Monk Daishin Eric McCabe"
                                  : currentCaseStudy === "youtube-pho-short"
                                    ? "Pho"
                                    : currentCaseStudy ===
                                        "youtube-videoboost-ad"
                                      ? "Videoboost Ad"
                                      : currentCaseStudy ===
                                          "instagram-food-teaser"
                                        ? "Teaser for Food Taste Test Video"
                                        : "Case Study"}
                </span>
              </div>

              {/* Mobile Breadcrumb - Just Case Study Name */}
              <div className="lg:hidden">
                <span className="text-black font-mono text-sm font-bold">
                  {currentCaseStudy === "savvo-sommelier"
                    ? "Savvo Digital Sommelier"
                    : currentCaseStudy === "hyvee-aisles"
                      ? "Hy-Vee Aisles Online"
                      : currentCaseStudy === "ascent-logistics"
                        ? "Ascent Global Logistics"
                        : currentCaseStudy === "bali-retreat"
                          ? "Bali Women's Retreat"
                          : currentCaseStudy === "youtube-josiah-schneider"
                            ? "Target Guy"
                            : currentCaseStudy === "youtube-demo-reel"
                              ? "Video Editing Demo Reel"
                              : currentCaseStudy === "instagram-holding-court"
                                ? "Holding Court Method"
                                : currentCaseStudy ===
                                    "youtube-zen-monk-podcast"
                                  ? "Podcast Episode with Zen Monk Daishin Eric McCabe"
                                  : currentCaseStudy === "youtube-pho-short"
                                    ? "Pho"
                                    : currentCaseStudy ===
                                        "youtube-videoboost-ad"
                                      ? "Videoboost Ad"
                                      : currentCaseStudy ===
                                          "instagram-food-teaser"
                                        ? "Teaser for Food Taste Test Video"
                                        : "Case Study"}
                </span>
              </div>

              {/* Back to Projects Button */}
              <button
                onClick={() => {
                  if (currentCaseStudy) {
                    setCurrentCaseStudy(null);
                  } else {
                    setIsProjectsFullscreenOpen(false);
                    setCurrentFullscreenType(null);
                  }
                }}
                className="px-3 py-1 bg-gray-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-xs"
              >
                ← Back to Home
              </button>
            </div>

            {/* Progress Bar - Under Breadcrumb */}
            <div className="w-full h-2 bg-black overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-desktop-blue via-blue-600 to-pink-500 transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>

          {/* Case Study Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:block">
            <CaseStudyNavigation isVisible={showNavigation} />
          </div>

          {/* Case Study Content */}
          <div
            className="w-full px-4 py-2 bg-gray-50"
            style={{ paddingBottom: "144px" }}
          >
            {currentCaseStudy === "hyvee-aisles" ? (
              /* Hy-Vee case study with Twilik Medium embed */
              <div className="max-w-4xl mx-auto">
                {/* Full Medium Article Content */}
                <div className="bg-gray-50">
                  {isLoadingArticle ? (
                    <div className="p-8">
                      <div className="animate-pulse">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      </div>
                    </div>
                  ) : articleError ? (
                    <div className="p-8 text-center">
                      <div className="text-red-500 mb-4">
                        <svg
                          className="w-12 h-12 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="font-semibold">Error loading article</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {articleError}
                        </p>
                      </div>
                      <a
                        href="https://medium.com/@caramocha/cards-tags-and-ads-ux-for-online-shopping-experience-10b577148105"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm"
                      >
                        Read on Medium →
                      </a>
                    </div>
                  ) : mediumArticle ? (
                    <div className="px-8 pt-2 pb-8">
                      {/* Article Title */}
                      <h1
                        style={{
                          fontFamily:
                            'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
                          fontSize: "42px",
                          fontWeight: "800",
                          lineHeight: "1.15",
                          letterSpacing: "-0.02em",
                          color: "#242424",
                          maxWidth: "782px",
                          margin: "0 auto 24px auto",
                          textAlign: "left",
                        }}
                      >
                        {mediumArticle.title}
                      </h1>

                      {/* Article Content */}
                      <div
                        className="medium-article-content"
                        style={{
                          fontFamily:
                            'Georgia, Charter, "Times New Roman", serif',
                          fontSize: "21px",
                          lineHeight: "1.58",
                          color: "#292929",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            if (
                              !mediumArticle.content &&
                              !mediumArticle.description
                            )
                              return "";

                            let processedContent =
                              mediumArticle.content ||
                              mediumArticle.description;

                            // Remove the original title if it exists in content
                            processedContent = processedContent
                              .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
                              .replace(/Cards, Tags, and Ads.*?Oh my!/gi, "")

                              // Apply consistent heading styles like Savvo
                              .replace(
                                /<h2([^>]*)>/gi,
                                '<h2$1 style="font-size: 36px; font-weight: 700; line-height: 1.3; margin: 48px 0 16px 0; color: #242424; font-family: sohne, Helvetica Neue, Helvetica, Arial, sans-serif;">',
                              )
                              .replace(
                                /<h3([^>]*)>/gi,
                                '<h3$1 style="font-size: 28px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0; color: #242424; font-family: sohne, Helvetica Neue, Helvetica, Arial, sans-serif;">',
                              )
                              .replace(
                                /<h4([^>]*)>/gi,
                                '<h4$1 style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 32px 0 16px 0; color: #242424; font-family: sohne, Helvetica Neue, Helvetica, Arial, sans-serif;">',
                              )

                              // Style paragraphs to match Savvo
                              .replace(
                                /<p([^>]*)>/gi,
                                '<p$1 style="font-family: charter, Georgia, Cambria, Times New Roman, Times, serif; font-size: 21px; line-height: 1.58; color: #242424; margin: 24px 0;">',
                              )

                              // Style blockquotes
                              .replace(
                                /<blockquote([^>]*)>/gi,
                                '<blockquote$1 style="border-left: 3px solid #242424; padding-left: 24px; margin: 32px 0; font-style: italic; font-size: 24px; color: #6B6B6B; font-family: charter, Georgia, Cambria, Times New Roman, Times, serif;">',
                              )

                              // Reduce first specific image by 75% and center
                              .replace(
                                /<img([^>]*?)src="([^"]*0\*_0x2AA-s2LJzlysW\.png[^"]*)"([^>]*?)>/g,
                                '<div style="display: flex !important; justify-content: center !important; align-items: center !important; margin: 32px 0 !important; width: 100% !important;"><img$1src="$2"$3 style="width: 25% !important; height: auto !important; max-width: 250px !important; cursor: pointer !important;" onclick="window.openLightbox && window.openLightbox(\'$2\')"></div>',
                              )

                              // Reduce second specific image by 75% and center
                              .replace(
                                /<img([^>]*?)src="([^"]*0\*eTh2iT-zL0OlU-lR\.png[^"]*)"([^>]*?)>/g,
                                '<div style="display: flex !important; justify-content: center !important; align-items: center !important; margin: 32px 0 !important; width: 100% !important;"><img$1src="$2"$3 style="width: 25% !important; height: auto !important; max-width: 250px !important; cursor: pointer !important;" onclick="window.openLightbox && window.openLightbox(\'$2\')"></div>',
                              )

                              // Style images to match Savvo layout
                              .replace(
                                /<img([^>]*?)src="([^"]*)"([^>]*?)>/g,
                                '<img$1src="$2"$3 style="width: 100%; height: auto; margin: 32px 0; max-width: 1000px; cursor: pointer;" onclick="window.openLightbox && window.openLightbox(\'$2\')">',
                              )

                              // Remove any remaining empty figure tags that might contain broken images
                              .replace(/<figure[^>]*>\s*<\/figure>/g, "")
                              .replace(
                                /<figure[^>]*>\s*<figcaption[^>]*>.*?<\/figcaption>\s*<\/figure>/g,
                                "",
                              )

                              // Clean up any extra whitespace
                              .replace(/\s*<\/p>\s*$/, "</p>")
                              .replace(/(<\/[^>]+>)\s*(<\/[^>]+>)/g, "$1$2");

                            return processedContent;
                          })(),
                        }}
                      />

                      {/* Article Footer */}
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setCurrentCaseStudy(null);
                              setIsProjectsFullscreenOpen(true);
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                          >
                            �� Back to Projects
                          </button>
                          <a
                            href={mediumArticle.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm group"
                          >
                            Read on Medium
                            <svg
                              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-500 mb-4">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="font-semibold">No article found</p>
                      </div>
                      <a
                        href="https://medium.com/@caramocha/cards-tags-and-ads-ux-for-online-shopping-experience-10b577148105"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm"
                      >
                        Read on Medium →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : currentCaseStudy === "ascent-logistics" ? (
              /* Ascent Global Logistics case study */
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-black mb-4">
                    Ascent Global Logistics
                  </h1>
                  <p className="text-gray-600 text-lg mb-6">
                    This is a project where I was the lead designer for their
                    logistics platform, Peak On-Demand (POD). They were going
                    through both a design and backend revamp for a 2.0 version.
                    This project took many months to complete and involved
                    working closely with engineering, PMs, and business
                    stakeholders.&nbsp;
                    <br />
                    <br />
                    Order Entry was one of the first overhauls we did using the
                    new design system and had extensive user testing and
                    iterations. The company was very happy with how it had
                    turned out.&nbsp;
                  </p>
                </div>

                {/* Interactive Case Study Section */}
                <div className="mt-8">
                  <h2
                    id="interactive-case-study"
                    className="text-2xl font-bold text-black mb-4 text-center"
                  >
                    Interactive Case Study
                  </h2>
                  <div className="bg-gray-50 w-full flex justify-center">
                    <iframe
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "80vh",
                        maxWidth: "100%",
                      }}
                      src="https://embed.figma.com/proto/2MQxSGbmQEHbyZg8JYepO4/UI-Portfolio?page-id=0%3A1&node-id=937-2926&p=f&viewport=526%2C493%2C0.02&scaling=contain&content-scaling=fixed&starting-point-node-id=915%3A1139&embed-host=share"
                      allowFullScreen
                      title="Ascent Global Logistics Case Study"
                    ></iframe>
                  </div>
                </div>

                {/* View Prototype Section */}
                <div className="mt-8">
                  <h2
                    id="view-prototype"
                    className="text-2xl font-bold text-black mb-4 text-center"
                  >
                    View Prototype
                  </h2>
                  <div className="bg-gray-50 w-full flex justify-center">
                    <iframe
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "80vh",
                        maxWidth: "100%",
                      }}
                      src="https://embed.figma.com/proto/bFieg2HMmJAqM3goTMNE3k/Order-Entry--FINAL-?page-id=919%3A21676&type=design&node-id=919-21860&viewport=121%2C1710%2C0.06&scaling=contain&starting-point-node-id=919%3A21860&content-scaling=fixed&embed-host=share"
                      allowFullScreen
                      title="Order Entry Prototype"
                    ></iframe>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "bali-retreat" ? (
              /* Bali Women's Retreat - Instagram Reel */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Bali Women's Retreat
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        A short reel capturing the journey and essence of an
                        all-women's retreat in Bali
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          This short reel was shot and edited during my
                          experience at an all-women's retreat in Bali. It
                          captures the essence of wellness, travel, and
                          community in a concise, visually engaging format
                          perfect for Instagram.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded Instagram Reel */}
                <div className="flex justify-center items-center py-12">
                  <div className="w-full max-w-lg">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg"
                      style={{ aspectRatio: "9 / 16" }}
                    >
                      <iframe
                        src="https://www.instagram.com/reel/DFZongxuHWj/embed/captioned/"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        style={{
                          border: "none",
                          overflow: "hidden",
                          minHeight: "600px",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "youtube-josiah-schneider" ? (
              /* YouTube Shorts - Target Guy */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Target Guy
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">Shorts</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          An shorts edit for actor/comedian Josiah Schneider.
                          Used a pre-written script for reference, added in sfx,
                          background, and music to heighten the comedy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded YouTube Video */}
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center justify-center">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg"
                      style={{ height: "90vh", aspectRatio: "9 / 16" }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/jMIY3JhZibU"
                        title="Target Guy"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          border: "none",
                          overflow: "hidden",
                          minHeight: "600px",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "youtube-demo-reel" ? (
              /* YouTube Video - Demo Reel */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Video Editing Demo Reel
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">Video</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Video editing demo reel
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded YouTube Video */}
                <div className="py-8">
                  <div className="max-w-6xl mx-auto px-6">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg w-full"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/phxDaMSYldc"
                        title="Video Editing Demo Reel"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "instagram-holding-court" ? (
              /* Instagram Reel - Holding Court Method */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Holding Court Method
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        Shorts, IG Reel
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Reel I created to illustrate a special visualization
                          technique I call "The Holding Court Method". Produced
                          and selected all the costumes myself! Edited with
                          CapCut special effects and green screen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded Instagram Reel */}
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center justify-center">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg"
                      style={{ height: "90vh", aspectRatio: "9 / 16" }}
                    >
                      <iframe
                        src="https://www.instagram.com/reel/C9fivuSumye/embed/captioned/"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "youtube-zen-monk-podcast" ? (
              /* YouTube Video - Podcast Episode with Zen Monk Daishin Eric McCabe */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Podcast Episode with Zen Monk Daishin Eric McCabe
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        podcast, YouTube
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Filmed, produced and edited this podcast episode where
                          I interviewed a Zen monk about the role of Zen
                          Buddhism in modern life.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded YouTube Video */}
                <div className="py-8">
                  <div className="max-w-6xl mx-auto px-6">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg w-full"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/Pys3JqhSejE"
                        title="Podcast Episode with Zen Monk Daishin Eric McCabe"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "youtube-pho-short" ? (
              /* YouTube Video - Pho Short Film */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Pho
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">
                        Short film, YouTube
                      </p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          I planned, shot, and edited this short humorous video
                          around the experience of eating phở. Post-production
                          done in Adobe Premiere Pro.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded YouTube Video */}
                <div className="py-8">
                  <div className="max-w-6xl mx-auto px-6">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg w-full"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/XAog5HHTw3o"
                        title="Pho"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "youtube-videoboost-ad" ? (
              /* YouTube Video - Videoboost Ad */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Videoboost Ad
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">Ad</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          Vertical social ad for Videoboost, a video editing
                          course
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded YouTube Video */}
                <div className="py-8">
                  <div className="max-w-6xl mx-auto px-6">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg w-full"
                      style={{ aspectRatio: "9 / 16" }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/Tgxs4sNVqYc"
                        title="Videoboost Ad"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : currentCaseStudy === "instagram-food-teaser" ? (
              /* Instagram Reel - Food Taste Test Teaser */
              <div className="max-w-4xl mx-auto">
                <div className="bg-gray-50 p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-black mb-4">
                        Teaser for Food Taste Test Video
                      </h1>
                      <p className="text-gray-600 text-lg mb-6">Promo shorts</p>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-4">
                          About This Project:
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          IG Reel Short teaser for a food taste test video on my
                          Youtube channel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embedded Instagram Reel */}
                <div className="py-8">
                  <div className="max-w-6xl mx-auto px-6">
                    <div
                      className="relative overflow-hidden rounded-lg shadow-lg w-full"
                      style={{ aspectRatio: "9 / 16" }}
                    >
                      <iframe
                        src="https://www.instagram.com/reel/DAUKzZZue5_/embed/captioned/"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Back to Projects Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>
                </div>
              </div>
            ) : (
              <>
                <MediumArticleEmbed
                  onImageClick={(src) => setLightboxImage(src)}
                  articleType={currentCaseStudy || "savvo-sommelier"}
                />

                {/* Buttons */}
                <div
                  style={{ marginTop: "32px" }}
                  className="flex items-center justify-between gap-8"
                >
                  <button
                    onClick={() => {
                      setCurrentCaseStudy(null);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
                  >
                    ← Back to Projects
                  </button>

                  <a
                    href="https://medium.com/@caramocha/ux-case-study-savvo-digital-sommelier-c2da6957105d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-mono text-sm group"
                  >
                    Read on Medium
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-bl from-purple-500 via-desktop-blue to-blue-800 overflow-hidden relative">
        {/* ASCII Art Background */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-20 transition-opacity duration-500"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "8px",
            lineHeight: "8px",
            color: "#ffffff",
            whiteSpace: "pre",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "scale(2.4)",
          }}
        >
          <pre
            className="select-none transition-colors duration-300 cursor-default"
            style={{
              margin: 0,
              padding: 0,
              background: "transparent",
              color: asciiArtColor,
            }}
          >
            {`





















                                                  -******************-*******
                                                  :***********************-*-
                                           *******-:::                       -****-*:
                                           -**--------                       -------:
                                       -**-  :     :::::::            :::::::        *-*
                                       -*-- ::     :::::::            :::::::        ***
                                   -*--:::     :::    :::::::::::::::::::                **-
                                   -**-:::     :::    :::::::::::::::::::                *-*
                               :***::::            :::::::            :-:::::               :**:       -*-*****-******-
                               :*--::::            :::::::           :-::::::               :**:       -****-*-**-*---:
                               :***:::::::     :::::::                   ::::::::           :**:    **-                ***:
                               :-**:::::::     :::::::                    :::::::           :**:    ***                *--:
                            ***----::::        :::                           ::::        :::::::***:                       ***:
                            -*-----::::        :::                           ::::        :::::::-**-                       ***:
                            ***----:::::::     :::    ::::                   ::::    :::::::    ---        -***            ***:
                            *-*----:::::::     :::    ::::                   ::::    :::::::    -**        -*-*            **-:
                            **---------::::-------::::    :::             ::-:::::::::::     :::*--:       :***            **-:
                            ***--------::::-------::::    ::::           :-:-:-:::::::::     :::-*-:       :**-            ***:
                        -**-:::::::-----------------------::::::::::::----------:        :::-***                           ***:
                        -**-:--::::-----------------------::::::::::::--------:::        :::-*-*                           **-:
                    :***::::::::---:::::::            -------------------           :**-**--::::               -***--**-**-
                    :***::::::::---:::::::            -------------------           :*-***-*::::               -**********:
                    :***----:::::::    ----:::::::::::        :::         :::::::*******::::               -*-***--***:
                    :*-****-:::::::    ---::::::::::::        :::         :::::::***-***-:::               -***-***---:
                        :***-*********-***-******-**-***************************-:::     **-   :    *******
                        :*-**-*****-****-****-***********--**--***-*******-****--:::     **-:  :    *****-*
                     ---    *-*-:::        ***:                      :**-::::            ************--:
                    :***    -**-:::        ***:                      :***::::            *-************:
                        -***-*-:           **-****:                  -*-*                ****-**       :***
                        --*****:           ****-**:              ::  -*-*                ******-       :-*-
                        --*-               -**-**------------------*-****            ***    :*-*           :---
                        -**-               **-***********************--*-            **-    :***           :**-
                        :**-           ----**-        :*-****-:::-******-            ***    :-*-           :**-
                        -*--           *****-*        :***--*-:::-**-**-*            **-    :***           :**-
                        -****--:   :---    ***-       -******--*--*-*********    ***    :***:   ***************-
                        *-*-***:   :***    -**-       -*-**********-**-**-***    *-*:   :**--   *******-*****---
                        ---:***-----**-:--:***-       -***-**************-**-----***-------*    --**-****--***-
                            *-*****-***-**-                              --*-***********-



















                                                                                                                                                   `}
          </pre>
        </div>
        {/* Header */}
        <header className="h-12 bg-white border-b-2 border-black flex items-center justify-between px-2 md:px-4 relative z-10">
          {/* Logo and Brand */}
          <button
            onClick={() => {
              // Reset all state to initial values
              setOpenWindows([
                {
                  id: "sticky1",
                  backgroundColor: "#F2B973",
                  headerColor: "#E68C4F",
                  initialX: window.innerWidth
                    ? Math.max(50, window.innerWidth / 2 - 350)
                    : 350,
                  initialY: window.innerHeight
                    ? Math.max(50, window.innerHeight / 2 - 150)
                    : 250,
                  zIndex: 10,
                  content: (
                    <div className="flex items-center h-full">
                      <p className="text-black text-base leading-6">
                        Hey! I'm <strong>Cara</strong>—your friendly
                        neighborhood <u>product designer</u> &{" "}
                        <u>content creator</u>. For <strong>8+ years</strong>,
                        I've helped people turn early ideas into thoughtful
                        products, beautiful visuals, and scroll-stopping
                        stories.
                        <br />
                        <br />
                        <i>What vision can we bring to life together?</i>
                      </p>
                    </div>
                  ),
                },
                {
                  id: "sticky2",
                  backgroundColor: "#F0A7CC",
                  headerColor: "#E68AA8",
                  initialX: window.innerWidth
                    ? Math.max(370, window.innerWidth / 2 + 30)
                    : 670,
                  initialY: window.innerHeight
                    ? Math.max(50, window.innerHeight / 2 - 150)
                    : 250,
                  zIndex: 11,
                  content: (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F004bc9981e154e2e9b9ede829f9f12cc?format=webp&width=800"
                        alt="Inspirational quote about freedom and living in the moment"
                        className="max-w-full max-h-full object-contain"
                        style={{ transform: "scale(1.75) translateY(4px)" }}
                      />
                    </div>
                  ),
                },
              ]);
              setNextZIndex(20);
              setIsProjectsFullscreenOpen(false);
              setCurrentFullscreenType(null);
              setCurrentCaseStudy(null);
              setScrollProgress(0);
              setHoveredProject(null);
              setPersistentHoveredProject(null);
              setLightboxImage(null);
              setShowNavigation(false);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F06b8f3812aef472ba6f2dbbdc9c5f523?format=webp&width=800"
              alt="Logo"
              className="w-10 h-10 md:w-14 md:h-14 object-contain"
            />
            <span
              className="text-black font-normal leading-6"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Cara Liu
            </span>
          </button>

          {/* Social Media Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/cara-liu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-desktop-blue hover:opacity-80 p-1"
              style={{ cursor: "pointer" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-6 md:h-6"
              >
                <path
                  d="M17.2802 17.2825H15.059V13.8018C15.059 12.9718 15.0421 11.9037 13.9015 11.9037C12.7434 11.9037 12.5665 12.8069 12.5665 13.7406V17.2825H10.3452V10.125H12.479V11.1006H12.5077C12.8059 10.5381 13.5309 9.94437 14.614 9.94437C16.8646 9.94437 17.2809 11.4257 17.2809 13.3538L17.2802 17.2825ZM7.83648 9.14562C7.12148 9.14562 6.5471 8.56687 6.5471 7.855C6.5471 7.14375 7.1221 6.56563 7.83648 6.56563C8.54898 6.56563 9.12648 7.14375 9.12648 7.855C9.12648 8.56687 8.54835 9.14562 7.83648 9.14562ZM8.95023 17.2825H6.72273V10.125H8.95023V17.2825ZM18.3915 4.5H5.60773C4.99585 4.5 4.50085 4.98375 4.50085 5.58063V18.4194C4.50085 19.0168 4.99585 19.5 5.60773 19.5H18.3896C19.0009 19.5 19.5009 19.0168 19.5009 18.4194V5.58063C19.5009 4.98375 19.0009 4.5 18.3896 4.5H18.3915Z"
                  fill="#5656E9"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@sentientbeans"
              target="_blank"
              rel="noopener noreferrer"
              className="text-desktop-blue hover:opacity-80 p-1"
              style={{ cursor: "pointer" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-6 md:h-6"
              >
                <path
                  d="M12.2032 5.33325C12.6483 5.3357 13.7619 5.34647 14.945 5.39386L15.3645 5.41215C16.5558 5.46855 17.746 5.5649 18.3364 5.7295C19.1238 5.95071 19.7427 6.59617 19.9519 7.41435C20.285 8.71359 20.3266 11.2494 20.3318 11.8631L20.3325 11.9903V11.9992C20.3325 11.9992 20.3325 12.0023 20.3325 12.0082L20.3318 12.1353C20.3266 12.749 20.285 15.2848 19.9519 16.5841C19.7398 17.4053 19.1209 18.0508 18.3364 18.2689C17.746 18.4335 16.5558 18.5298 15.3645 18.5863L14.945 18.6045C13.7619 18.6519 12.6483 18.6627 12.2032 18.6652L12.0079 18.6658H11.9992C11.9992 18.6658 11.9963 18.6658 11.9905 18.6658L11.7954 18.6652C10.8534 18.66 6.91473 18.6174 5.66205 18.2689C4.87463 18.0477 4.25573 17.4023 4.04652 16.5841C3.71346 15.2848 3.67183 12.749 3.66663 12.1353V11.8631C3.67183 11.2494 3.71346 8.71359 4.04652 7.41435C4.25863 6.59314 4.87753 5.94769 5.66205 5.7295C6.91473 5.38094 10.8534 5.33844 11.7954 5.33325H12.2032ZM10.3326 9.08254V14.9158L15.3325 11.9992L10.3326 9.08254Z"
                  fill="#5656E9"
                />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/cara.leo_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-desktop-blue hover:opacity-80 p-1"
              style={{ cursor: "pointer" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-6 md:h-6"
              >
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"
                  fill="#5656E9"
                />
              </svg>
            </a>
          </div>
        </header>

        <main className="relative h-[calc(100vh-48px)]">
          {/* Desktop Layout - Desktop Only */}
          <div className="hidden lg:block">
            {/* First Column - Left Side */}
            {/* Product Design Icon - Top of first column */}
            <div
              className="absolute z-20 flex items-start justify-center"
              style={{
                top: "calc(24px + 1vw)",
                left: "calc(24px + 1vw)",
                width: "160px",
              }}
              onMouseEnter={() => setAsciiArtColor("#c084fc")}
              onMouseLeave={() => setAsciiArtColor("#ffffff")}
            >
              <DesktopIcon
                icon={<ProductDesignIcon />}
                label="Product Design"
                onClick={() => openNewWindow("Product Design")}
                className="scale-75 md:scale-90"
              />
            </div>

            {/* Content Creation Icon - Second in first column */}
            <div
              className="absolute z-20 flex items-start justify-center"
              style={{
                top: "calc(24px + 1vw + 142px)",
                left: "calc(24px + 1vw)",
                width: "160px",
              }}
              onMouseEnter={() => setAsciiArtColor("#f472b6")}
              onMouseLeave={() => setAsciiArtColor("#ffffff")}
            >
              <DesktopIcon
                icon={<ContentCreationIcon />}
                label="Content Creation"
                onClick={() => openNewWindow("Content Creation")}
                className="scale-75 md:scale-90"
              />
            </div>

            {/* About Icon - Third in first column */}
            <div
              className="absolute z-20 flex items-start justify-center"
              style={{
                top: "calc(24px + 1vw + 284px)",
                left: "calc(24px + 1vw)",
                width: "160px",
              }}
              onMouseEnter={() => setAsciiArtColor("#3b82f6")}
              onMouseLeave={() => setAsciiArtColor("#ffffff")}
            >
              <DesktopIcon
                icon={<AboutIcon />}
                label="About"
                onClick={() => openNewWindow("About")}
                className="scale-75 md:scale-90"
              />
            </div>

            {/* Contact Me Icon - Fourth in first column */}
            <div
              className="absolute z-20 flex items-start justify-center"
              style={{
                top: "calc(24px + 1vw + 426px)",
                left: "calc(24px + 1vw)",
                width: "160px",
              }}
              onMouseEnter={() => setAsciiArtColor("#ec4899")}
              onMouseLeave={() => setAsciiArtColor("#ffffff")}
            >
              <DesktopIcon
                icon={<ContactIcon />}
                label="Contact Me"
                onClick={() => openNewWindow("Contact")}
                className="scale-75 md:scale-90"
              />
            </div>

            {/* Listen Icon - Top right */}
            <div
              className="absolute z-20 hidden"
              style={{ top: "calc(24px + 1vw)", right: "calc(24px + 1vw)" }}
            >
              <DesktopIcon
                icon={<PlaylistIcon />}
                label="Listen"
                onClick={() => openNewWindow("Playlist")}
                className="scale-75 md:scale-90"
              />
            </div>

            {/* Recycling Icon - Bottom right, aligned with Listen column */}
            <div
              className="absolute z-20"
              style={{ bottom: "calc(24px + 1vw)", right: "calc(24px + 1vw)" }}
            >
              <DesktopIcon
                icon={<RecyclingIcon />}
                label="Recycling Bin"
                title="I'm just a humble trash can..."
                onClick={() => setShowRecyclingTooltip(!showRecyclingTooltip)}
                className="scale-75 md:scale-90"
              />
              {showRecyclingTooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black text-white text-sm rounded shadow-lg whitespace-nowrap z-30">
                  I'm just a humble trash can...
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Layout - Grid Layout */}
          <div className="lg:hidden p-4">
            {/* Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              <div className="flex justify-center">
                <DesktopIcon
                  icon={<ProductDesignIcon />}
                  label="Product Design"
                  onClick={() => openNewWindow("Product Design")}
                  className="scale-90"
                />
              </div>
              <div className="flex justify-center">
                <DesktopIcon
                  icon={<AboutIcon />}
                  label="About"
                  onClick={() => openNewWindow("About")}
                  className="scale-90"
                />
              </div>
              <div className="flex justify-center">
                <DesktopIcon
                  icon={<ContentCreationIcon />}
                  label="Content Creation"
                  onClick={() => openNewWindow("Content Creation")}
                  className="scale-90"
                />
              </div>
              <div className="flex justify-center">
                <DesktopIcon
                  icon={<ContactIcon />}
                  label="Contact Me"
                  onClick={() => openNewWindow("Contact")}
                  className="scale-90"
                />
              </div>
              <div className="flex justify-center">
                <DesktopIcon
                  icon={<RecyclingIcon />}
                  label="Recycling Bin"
                  title="I'm just a humble trash can..."
                  onClick={() => setShowRecyclingTooltip(!showRecyclingTooltip)}
                  className="scale-90"
                />
              </div>
            </div>
          </div>

          {/* Draggable Windows - Non-sticky windows only */}
          {openWindows
            .filter((window) => !window.id.startsWith("sticky"))
            .map((window) => (
              <DraggableWindow
                key={window.id}
                backgroundColor={window.backgroundColor}
                headerColor={window.headerColor}
                initialX={window.initialX}
                initialY={window.initialY}
                width={window.width}
                height={window.height}
                zIndex={window.zIndex}
                title={
                  window.id.startsWith("Articles")
                    ? "Articles"
                    : window.id.startsWith("Projects")
                      ? "Projects"
                      : window.id.startsWith("About")
                        ? "About"
                        : undefined
                }
                resizable={!window.id.startsWith("sticky")}
                onClose={() => closeWindow(window.id)}
                onBringToFront={() => bringToFront(window.id)}
              >
                {window.content}
              </DraggableWindow>
            ))}

          {/* Sticky Notes - Responsive Layout */}
          {/* Desktop: Centered draggable windows */}
          <div className="hidden lg:block">
            {openWindows
              .filter((window) => window.id.startsWith("sticky"))
              .map((window) => (
                <DraggableWindow
                  key={window.id}
                  backgroundColor={window.backgroundColor}
                  headerColor={window.headerColor}
                  initialX={window.initialX}
                  initialY={window.initialY}
                  width={window.width}
                  height={window.height}
                  zIndex={window.zIndex}
                  resizable={false}
                  onClose={() => closeWindow(window.id)}
                  onBringToFront={() => bringToFront(window.id)}
                >
                  {window.content}
                </DraggableWindow>
              ))}
          </div>

          {/* Mobile/Tablet: Horizontal scrolling sticky notes */}
          <div className="lg:hidden fixed bottom-4 left-0 right-0 z-20">
            <div className="overflow-x-auto px-4">
              <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
                {openWindows
                  .filter((window) => window.id.startsWith("sticky"))
                  .map((window) => (
                    <div
                      key={window.id}
                      className="flex-shrink-0 w-72 h-64 p-4 border-2 border-black shadow-lg"
                      style={{
                        backgroundColor: window.backgroundColor,
                        borderColor: window.headerColor,
                      }}
                    >
                      {window.content}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer Tag */}
          <div
            className="fixed bottom-4 z-10"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "10px",
              color: "rgb(120, 184, 241)",
              left: "calc(24px + 1vw)",
            }}
          >
            Built with ❤️ by Builder.io, Claude, and Figma Make. Copyright ©{" "}
            {new Date().getFullYear()} Cara Liu
          </div>
        </main>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          imageSrc={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}
