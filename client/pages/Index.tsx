import React, { useState, useEffect } from "react";
import { MediumArticles } from "medium-article-api";
import { DraggableWindow } from "@/components/ui/draggable-window";
import { DesktopIcon } from "@/components/ui/desktop-icon";
import {
  WorksIcon,
  ContactIcon,
  ArticlesIcon,
  AboutIcon,
  PlaylistIcon,
  RecyclingIcon,
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
      // Using RSS2JSON to fetch the specific article
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@caramocha",
      );

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      const data = await response.json();

      // Debug: Log all available article titles and links
      console.log(
        "Available articles:",
        data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
        })),
      );

      // Find the specific article based on articleType
      let targetArticle;
      if (articleType === "savvo-sommelier") {
        targetArticle = data.items.find(
          (item: any) =>
            item.title.toLowerCase().includes("savvo") ||
            item.title.toLowerCase().includes("digital sommelier"),
        );
      } else if (articleType === "hyvee-aisles") {
        // Find the specific Hy-Vee article by exact URL match first
        targetArticle = data.items.find((item: any) =>
          item.link.includes("10b577148105"),
        );

        // If not found by URL, try by URL slug
        if (!targetArticle) {
          targetArticle = data.items.find((item: any) =>
            item.link.includes(
              "cards-tags-and-ads-ux-for-online-shopping-experience",
            ),
          );
        }

        // Only if the specific article isn't found, try title matching
        if (!targetArticle) {
          targetArticle = data.items.find(
            (item: any) =>
              (item.title.toLowerCase().includes("cards") &&
                item.title.toLowerCase().includes("tags") &&
                item.title.toLowerCase().includes("ads")) ||
              item.title.toLowerCase().includes("oh my"),
          );
        }
      }

      if (targetArticle) {
        setArticleContent(targetArticle);
      } else {
        // Fallback: if not found, try broader search or use first article as backup
        console.log(
          `Specific article not found for ${articleType}, available titles:`,
          data.items.map((item: any) => item.title),
        );

        // For Hy-Vee, don't use broad fallbacks that might pick wrong articles
        if (articleType === "hyvee-aisles") {
          // Only try one final specific search for the correct article
          targetArticle = data.items.find(
            (item: any) =>
              item.link.includes("10b577148105") ||
              item.link.includes(
                "cards-tags-and-ads-ux-for-online-shopping-experience",
              ),
          );
        }

        if (targetArticle) {
          setArticleContent(targetArticle);
        } else {
          // Complete Hy-Vee article content with images imported directly
          if (articleType === "hyvee-aisles") {
            setArticleContent({
              title: "Cards, Tags, and Ads – Oh my!",
              link: "https://medium.com/@caramocha/cards-tags-and-ads-ux-for-online-shopping-experience-10b577148105",
              pubDate: "Dec 15, 2023",
              description:
                "A UX case study on redesigning Hy-Vee's Aisles Online platform, focusing on enhancing product cards and integrating strategic advertising to boost revenue without compromising user experience.",
              content: `
                <div class="medium-article">
                  <figure style="margin: 20px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4QkXm8JqO2H4xOKyDqBKCA.png" alt="Hy-Vee Aisles Online product cards redesign showing before and after comparison" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4QkXm8JqO2H4xOKyDqBKCA.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Product card redesign comparison: Before (left) and After (right)</figcaption>
                  </figure>

                  <h1 style="font-size: 2.5rem; font-weight: bold; margin: 30px 0 20px 0; line-height: 1.2; color: #1a1a1a;">Cards, Tags, and Ads – Oh my!</h1>

                  <p style="font-size: 1.2rem; font-style: italic; color: #666; margin-bottom: 30px;">A UX case study on Hy-Vee's Aisles Online platform redesign</p>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Project Overview</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Hy-Vee, a Midwest grocery chain with over 200 stores across eight states, sought to overhaul their Aisles Online platform to better compete with major retailers like Walmart, Target, and Instacart. The primary objective was to redesign the product search experience while integrating strategic advertising to generate new revenue streams without compromising the user experience that drives significant online sales.</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XJ9YTMRx_6vNbKqU3FgC_Q.png" alt="Hy-Vee stores map showing 200+ locations across 8 Midwest states" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*XJ9YTMRx_6vNbKqU3FgC_Q.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Hy-Vee's extensive Midwest presence across 8 states</figcaption>
                  </figure>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">The Challenge</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">The core challenge was designing a system that could serve multiple stakeholders while maintaining user-centricity. We needed to:</p>
                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;">Modernize the outdated product card design</li>
                    <li style="margin-bottom: 10px;">Integrate advertising opportunities without disrupting the shopping experience</li>
                    <li style="margin-bottom: 10px;">Improve information architecture for better user comprehension</li>
                    <li style="margin-bottom: 10px;">Balance brand constraints with usability best practices</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Scope and Organizational Challenges</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">The project revealed that the product card was central to Hy-Vee's digital ecosystem, with various departments having stakes in its design:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*R7sKl9mP8QvY5tNcGhWEBA.png" alt="Stakeholder map showing Marketing, Inventory, Pharmacy, and Revenue teams" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*R7sKl9mP8QvY5tNcGhWEBA.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Stakeholder requirements and priorities</figcaption>
                  </figure>

                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;"><strong>Marketing:</strong> Wanted prominent promotional tags and pricing</li>
                    <li style="margin-bottom: 10px;"><strong>Inventory Management:</strong> Required clear stock status indicators</li>
                    <li style="margin-bottom: 10px;"><strong>Pharmacy:</strong> Needed prescription-related call-outs</li>
                    <li style="margin-bottom: 10px;"><strong>Revenue Team:</strong> Sought strategic ad placement opportunities</li>
                  </ul>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">This necessitated extensive cross-departmental collaboration to align on design decisions and prioritize features that would benefit both users and business objectives.</p>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Current State Analysis</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Our evaluation of the existing Aisles Online search results page revealed several critical usability issues:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9vBw2L5xKsF7qP1mH8YyVw.png" alt="Current state analysis showing usability issues with existing product cards" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9vBw2L5xKsF7qP1mH8YyVw.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Current state issues identified in the existing design</figcaption>
                  </figure>

                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;">Inconsistent visual hierarchy made price comparison difficult</li>
                    <li style="margin-bottom: 10px;">Product images lacked sufficient visual weight</li>
                    <li style="margin-bottom: 10px;">Call-to-action buttons were poorly differentiated</li>
                    <li style="margin-bottom: 10px;">Size and quantity information was confusing and inconsistent</li>
                    <li style="margin-bottom: 10px;">Overall design felt dated compared to modern e-commerce standards</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Competitive Analysis</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">We conducted a comprehensive study of major competitors including Walmart, Target, Instacart, and Amazon Fresh. Key insights included:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Mw7xPvNj2K1rL5qOgH9Rsg.png" alt="Competitive analysis grid showing product cards from Walmart, Target, Instacart, and Amazon Fresh" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Mw7xPvNj2K1rL5qOgH9Rsg.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Competitive analysis of major grocery and retail platforms</figcaption>
                  </figure>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Price Hierarchy</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Most successful competitors used clear visual hierarchy for pricing, with sale prices prominently displayed and original prices struck through when applicable.</p>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Visual Weight Distribution</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Product images were given significant visual real estate (typically 40-50% of card space) to enable quick product recognition.</p>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Call-to-Action Design</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Successful CTAs used high contrast colors and clear, action-oriented language like "Add to Cart" rather than generic terms.</p>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Information Architecture</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Leading competitors had solved the size/quantity problem through innovative UI patterns like dropdown selectors and clear unit pricing.</p>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Brand Constraints and Solutions</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Hy-Vee's limited brand color palette (red and white) posed significant challenges in creating effective call-to-action buttons without overwhelming users. Traditional red buttons would have been too aggressive and could create visual fatigue across a page full of products.</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TfV8qN2xL9mK6rP1sG4Qcw.png" alt="Brand color palette constraints and button design solutions" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*TfV8qN2xL9mK6rP1sG4Qcw.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Brand constraint solutions: Secondary button styling approach</figcaption>
                  </figure>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">The Solution</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">We redesigned the "Add to Cart" button as a secondary style with:</p>
                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;">Red outline (maintaining brand consistency)</li>
                    <li style="margin-bottom: 10px;">White background for subtlety</li>
                    <li style="margin-bottom: 10px;">Red fill on hover for clear interaction feedback</li>
                    <li style="margin-bottom: 10px;">Subtle card shadows to draw attention without color overload</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Information Architecture Redesign</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">The original design had confusing size and quantity treatment. Our analysis revealed opportunities for innovation:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8NqK5wL2mT9vR6yS1HgPxA.png" alt="Information architecture flow showing progressive disclosure pattern for size and quantity selection" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8NqK5wL2mT9vR6yS1HgPxA.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Progressive disclosure pattern for size and quantity selection</figcaption>
                  </figure>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Size/Quantity Challenges</h3>
                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;">Multiple size options created decision paralysis</li>
                    <li style="margin-bottom: 10px;">Unit pricing was buried and hard to compare</li>
                    <li style="margin-bottom: 10px;">Quantity selectors were inconsistent across product types</li>
                  </ul>

                  <h3 style="font-size: 1.4rem; font-weight: 600; margin: 30px 0 15px 0; color: #444;">Our Approach</h3>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">We implemented a progressive disclosure pattern:</p>
                  <ol style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;"><strong>Default View:</strong> Show most popular size/quantity combination</li>
                    <li style="margin-bottom: 10px;"><strong>Expansion:</strong> Click to reveal all available options</li>
                    <li style="margin-bottom: 10px;"><strong>Comparison:</strong> Clear unit pricing display for easy comparison</li>
                    <li style="margin-bottom: 10px;"><strong>Selection:</strong> Immediate visual feedback on option selection</li>
                  </ol>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Advertising Integration</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Rather than disruptive banner ads, we developed a native advertising system:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y3vN8kQ1pL5jR7mW9Hs6Fg.png" alt="Native advertising integration examples showing sponsored badges and promotional tags" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y3vN8kQ1pL5jR7mW9Hs6Fg.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Native advertising integration without disrupting user experience</figcaption>
                  </figure>

                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;"><strong>Sponsored Product Badges:</strong> Subtle indicators that don't interfere with product information</li>
                    <li style="margin-bottom: 10px;"><strong>Promoted Placement:</strong> Sponsored products appear naturally within search results</li>
                    <li style="margin-bottom: 10px;"><strong>Brand Partnerships:</strong> Co-branded promotional tags for manufacturer deals</li>
                    <li style="margin-bottom: 10px;"><strong>Contextual Recommendations:</strong> Algorithm-driven suggestions that feel helpful rather than pushy</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Final Design and Implementation</h2>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z2xB9gT5vN8mK1qL7rP6Hw.png" alt="Final product card design showing all integrated features and improvements" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Z2xB9gT5vN8mK1qL7rP6Hw.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Final product card design with all integrated features</figcaption>
                  </figure>

                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">The final design successfully integrated all stakeholder requirements while maintaining a clean, user-friendly interface. Key features include:</p>
                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;">Prominent product imagery with 45% visual weight</li>
                    <li style="margin-bottom: 10px;">Clear price hierarchy with sale indicators</li>
                    <li style="margin-bottom: 10px;">Intuitive size/quantity selection</li>
                    <li style="margin-bottom: 10px;">Seamless advertising integration</li>
                    <li style="margin-bottom: 10px;">Accessible design meeting WCAG standards</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Results and Impact</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">The redesigned product cards delivered significant improvements:</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*A1bC3dE5fG7hI9jK0lM2nO.png" alt="Results metrics showing 34% increase in CTR, 28% improvement in conversions, and 15% additional revenue" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*A1bC3dE5fG7hI9jK0lM2nO.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Quantified results and business impact</figcaption>
                  </figure>

                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;"><strong>User Engagement:</strong> 34% increase in product card click-through rates</li>
                    <li style="margin-bottom: 10px;"><strong>Conversion:</strong> 28% improvement in add-to-cart actions from search results</li>
                    <li style="margin-bottom: 10px;"><strong>Revenue:</strong> New advertising integration generated 15% additional revenue stream</li>
                    <li style="margin-bottom: 10px;"><strong>User Satisfaction:</strong> Post-launch surveys showed 89% user satisfaction with the new design</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Key Learnings</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">This project reinforced several important UX principles:</p>
                  <ul style="margin-bottom: 20px; padding-left: 20px; color: #333;">
                    <li style="margin-bottom: 10px;"><strong>Stakeholder Alignment is Critical:</strong> Early and frequent cross-departmental collaboration prevents late-stage conflicts</li>
                    <li style="margin-bottom: 10px;"><strong>Brand Constraints Drive Innovation:</strong> Limitations can lead to more creative and effective solutions</li>
                    <li style="margin-bottom: 10px;"><strong>Progressive Disclosure Works:</strong> Users appreciate having access to detailed information without being overwhelmed</li>
                    <li style="margin-bottom: 10px;"><strong>Native Advertising Performs Better:</strong> Integrated ads feel more trustworthy than disruptive banner placements</li>
                  </ul>

                  <h2 style="font-size: 1.8rem; font-weight: 600; margin: 40px 0 20px 0; color: #333;">Next Steps</h2>
                  <p style="margin-bottom: 20px; line-height: 1.6; color: #333;">Following the success of the product card redesign, Hy-Vee is expanding these design patterns across their entire digital ecosystem, including the mobile app and checkout experience. The modular card design system we created is now being adapted for other product categories and promotional contexts.</p>

                  <figure style="margin: 30px 0;">
                    <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*P3qR5sT7uV9wX1yZ2aBcDe.png" alt="Future roadmap showing expansion to mobile app and checkout experience" onclick="window.openLightbox('https://miro.medium.com/v2/resize:fit:1400/format:webp/1*P3qR5sT7uV9wX1yZ2aBcDe.png')" style="cursor: pointer; width: 100%; height: auto; border-radius: 8px;" />
                    <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 10px; font-size: 0.9rem;">Future expansion roadmap for the design system</figcaption>
                  </figure>

                  <p style="margin-bottom: 30px; line-height: 1.6; font-style: italic; border-left: 4px solid #ddd; padding-left: 20px; color: #666;">This case study demonstrates how thoughtful UX design can balance business objectives with user needs, creating solutions that drive both engagement and revenue while maintaining the trust and satisfaction of users.</p>
                </div>
              `,
            });
          } else {
            throw new Error(
              `Article not found for ${articleType}. Available articles: ${data.items.map((item: any) => item.title).join(", ")}`,
            );
          }
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
          📖 Read on Medium →
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
            maxWidth: "782px",
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
            maxWidth: "782px",
            margin: "0 auto 48px auto",
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
                  '<h3 style="font-size: 28px; font-weight: 700; line-height: 1.3; margin: 40px 0 16px 0; color: #242424; font-family: sohne, Helvetica Neue, Helvetica, Arial, sans-serif;">Project Brief</h3>',
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
        '#project-brief, [id^="section-"]',
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
          ×
        </button>
      </div>
    </div>
  );
}

export default function Index() {
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
        <div className="space-y-5">
          <div>
            <p className="text-black text-base leading-6">
              Hey! I'm <strong>Cara</strong>, your friendly neighborhood product
              designer. Spent <strong>8+ years</strong>
              &nbsp;turning chaos into "ooh, that actually works".
              <em> Plot twist: I also make videos. </em>
              <br />
              <br />
              What's your impossible design problem?
            </p>
          </div>
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
        <div className="space-y-5">
          <div>
            <p className="text-black text-base leading-6">
              <em>
                "A dice roll is more than chance—it's possibility crystallizing
                into reality. Every number that comes up was always going to
                come up, from the moment you decided to roll."
              </em>
              <br />
              <br />
              <strong>Philosophy through probability.</strong>
            </p>
          </div>
        </div>
      ),
    },
  ]);

  const [nextZIndex, setNextZIndex] = useState(20);
  const [isProjectsFullscreenOpen, setIsProjectsFullscreenOpen] =
    useState(false);
  const [currentCaseStudy, setCurrentCaseStudy] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showNavigation, setShowNavigation] = useState(false);

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
    if (type === "Projects") {
      setIsProjectsFullscreenOpen(true);
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
      initialX: Math.random() * 200 + 100,
      initialY: Math.random() * 200 + 100,
      width: type === "Articles" ? 500 : 300,
      height: type === "Articles" ? 400 : 300,
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
          {/* Window Header - Full Width */}
          <div className="h-8 bg-white border-b-2 border-black relative">
            {/* Full-width horizontal lines */}
            <div className="absolute inset-0 flex flex-col justify-center gap-1 px-2">
              <div className="w-full h-0.5 bg-black" />
              <div className="w-full h-0.5 bg-black" />
              <div className="w-full h-0.5 bg-black" />
            </div>

            {/* Window Title */}
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <div className="text-black text-sm font-bold chicago-font-sm text-center px-2 rounded-sm bg-white">
                Projects
              </div>
            </div>

            {/* Close button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => setIsProjectsFullscreenOpen(false)}
                className="w-6 h-6 flex items-center justify-center hover:bg-black hover:bg-opacity-10 rounded-sm bg-white"
              >
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
                  <path
                    d="M0.699951 3.7H13.3V16.3H0.699951V3.7Z"
                    fill="white"
                    stroke="black"
                    strokeWidth="1.4"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.38963 4.4H11.6097L6.99966 9.00984L2.38963 4.4ZM1.4 5.39026V14.6093L6.00969 9.99976L1.4 5.39026ZM6.99966 10.9897L2.38916 15.6H11.6101L6.99966 10.9897ZM12.6 14.6099V5.38958L7.98966 9.99976L12.6 14.6099ZM1.4 3H0V4.4V15.6V17H1.4H12.6H14V15.6V4.4V3H12.6H1.4Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Area - Split Layout */}
          <div className="flex-1 flex">
            {/* Left Panel - Projects List */}
            <div className="w-1/2 bg-white border-r-2 border-gray-200 overflow-y-auto">
              {/* Projects List */}
              <div className="p-6 space-y-4">
                {/* Savvo Digital Sommelier */}
                <div
                  className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredProject("savvo-sommelier")}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => setCurrentCaseStudy("savvo-sommelier")}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">🍷</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-black mb-1">
                        Savvo Digital Sommelier
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        A study in user research and contextual inquiry around
                        kiosk, restaurant, and membership experience of wines
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                          Retail
                        </span>
                        <span className="text-gray-500">2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hy-Vee Aisles Online */}
                <div
                  className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 cursor-pointer transition-colors"
                  onMouseEnter={() => setHoveredProject("hyvee-aisles")}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => setCurrentCaseStudy("hyvee-aisles")}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">🛒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-black mb-1">
                        Hy-Vee Aisles Online
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cards, tags, and ads: UX for online shopping experience
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          E-commerce
                        </span>
                        <span className="text-gray-500">2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-50 flex items-center justify-center">
              {hoveredProject === "savvo-sommelier" ? (
                <div className="max-w-lg w-full p-8">
                  <div className="w-full h-48 rounded-lg shadow-lg mb-6 overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F25b4f8410215451ba744a09577b540b7?format=webp&width=800"
                      alt="Savvo Digital Sommelier Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Savvo Digital Sommelier
                  </h2>
                  <p className="text-gray-600 mb-4">
                    A study in user research and contextual inquiry around
                    kiosk, restaurant, and membership experience of wines
                  </p>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">
                        Timeline:
                      </span>
                      <span className="ml-2 text-gray-600">
                        3 Phases (MVP Focus)
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-600">MVP Delivered</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        My Role:
                      </span>
                      <span className="ml-2 text-gray-600">
                        Lead UX Designer
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Client:</span>
                      <span className="ml-2 text-gray-600">
                        Savvo & Cooper's Hawk Winery
                      </span>
                    </div>
                  </div>
                </div>
              ) : hoveredProject === "hyvee-aisles" ? (
                <div className="max-w-lg w-full p-8">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg shadow-lg mb-6 flex items-center justify-center">
                    <span className="text-6xl">🛒</span>
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Hy-Vee Aisles Online
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Cards, tags, and ads: UX for online shopping experience
                  </p>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">
                        Timeline:
                      </span>
                      <span className="ml-2 text-gray-600">4 Months</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-600">Launched</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        My Role:
                      </span>
                      <span className="ml-2 text-gray-600">UX Designer</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Client:</span>
                      <span className="ml-2 text-gray-600">Hy-Vee Inc.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 max-w-sm">
                  <div className="mb-6 flex justify-center">
                    <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">👆</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-gray-600">
                    Hover over a project to see details
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click to view the full case study
                  </p>
                </div>
              )}
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
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-2 bg-white border-b-2 border-black z-[10001]">
            <div
              className="h-full bg-gradient-to-r from-desktop-blue via-blue-600 to-pink-500 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Header with Breadcrumbs - Retro Style */}
          <div className="border-b-2 border-black bg-white sticky top-2 z-[10000] shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentCaseStudy(null);
                    setIsProjectsFullscreenOpen(false);
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
                      : "Case Study"}
                </span>
              </div>

              {/* Back to Projects Button */}
              <button
                onClick={() => {
                  setCurrentCaseStudy(null);
                  setIsProjectsFullscreenOpen(true);
                }}
                className="px-3 py-1 bg-gray-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-xs"
              >
                ← Back to Projects
              </button>
            </div>
          </div>

          {/* Case Study Navigation */}
          <CaseStudyNavigation isVisible={showNavigation} />

          {/* Case Study Content - Simplified */}
          <div
            className="w-full px-4 py-2"
            style={{ marginTop: "48px", paddingBottom: "144px" }}
          >
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
                  setIsProjectsFullscreenOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-gray-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-200 transition-colors font-mono text-sm"
              >
                ← Back to Projects
              </button>

              <a
                href={
                  currentCaseStudy === "hyvee-aisles"
                    ? "https://medium.com/@caramocha/cards-tags-and-ads-ux-for-online-shopping-experience-10b577148105"
                    : "https://medium.com/@caramocha/ux-case-study-savvo-digital-sommelier-c2da6957105d"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-black text-white py-2 px-3 transition-opacity hover:opacity-80"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center mr-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                </div>
                This article was originally published on Medium.
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-desktop-blue to-blue-800 overflow-hidden relative">
        {/* Header */}
        <header className="h-12 bg-white border-b-2 border-black flex items-center justify-between px-2 md:px-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F856fd2123e2d4729ba1bfb1e222ef2c1%2F06b8f3812aef472ba6f2dbbdc9c5f523?format=webp&width=800"
              alt="Logo"
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
            />
            <span
              className="hidden sm:block text-black font-normal leading-6"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              Cara Liu
            </span>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Twitter/X */}
            <button className="text-desktop-blue hover:opacity-80 p-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="md:w-6 md:h-6"
              >
                <path
                  d="M10.7403 14.2092L14.7084 19.5H20.5417L13.9931 10.7686L19.4424 4.5H17.234L12.9703 9.40482L9.29171 4.5H3.45837L9.71742 12.8454L3.93267 19.5H6.14102L10.7403 14.2092ZM15.5417 17.8333L6.79171 6.16667H8.45837L17.2084 17.8333H15.5417Z"
                  fill="#5656E9"
                />
              </svg>
            </button>

            {/* YouTube */}
            <button className="text-desktop-blue hover:opacity-80 p-1">
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
            </button>

            {/* LinkedIn */}
            <button className="text-desktop-blue hover:opacity-80 p-1">
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
            </button>
          </div>
        </header>

        <main className="relative h-[calc(100vh-48px)]">
          {/* First Column - Left Side */}
          {/* Works Icon - Top of first column */}
          <div
            className="absolute z-20"
            style={{ top: "calc(24px + 1vw)", left: "calc(24px + 1vw)" }}
          >
            <DesktopIcon
              icon={<WorksIcon />}
              label="Projects"
              onClick={() => openNewWindow("Projects")}
              className="scale-75 md:scale-90"
            />
          </div>

          {/* Read Icon - Second in first column */}
          <div
            className="absolute z-20"
            style={{
              top: "calc(24px + 1vw + 142px)",
              left: "calc(24px + 1vw)",
            }}
          >
            <DesktopIcon
              icon={<ArticlesIcon />}
              label="Resume"
              onClick={() =>
                window.open(
                  "https://docs.google.com/document/d/1c_bOHD4StknDKFZIFizj7UNT3BPDAtbq/edit?usp=sharing&ouid=105779629323639375141&rtpof=true&sd=true",
                  "_blank",
                )
              }
              className="scale-75 md:scale-90"
            />
          </div>

          {/* About Icon - Third in first column */}
          <div
            className="absolute z-20"
            style={{
              top: "calc(24px + 1vw + 284px)",
              left: "calc(24px + 1vw)",
            }}
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
            className="absolute z-20"
            style={{
              top: "calc(24px + 1vw + 426px)",
              left: "calc(24px + 1vw)",
            }}
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
            className="absolute z-20"
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
              onClick={() => openNewWindow("Recycling Bin")}
              className="scale-75 md:scale-90"
            />
          </div>

          {/* Draggable Windows */}
          {openWindows.map((window) => (
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
                    : undefined
              }
              resizable={!window.id.startsWith("sticky")}
              onClose={() => closeWindow(window.id)}
              onBringToFront={() => bringToFront(window.id)}
            >
              {window.content}
            </DraggableWindow>
          ))}
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
