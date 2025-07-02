import React, { useState } from "react";
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

export default function Index() {
  const [openWindows, setOpenWindows] = useState<WindowConfig[]>([
    {
      id: "sticky1",
      backgroundColor: "#F2B973",
      headerColor: "#E68C4F",
      initialX: 490,
      initialY: 187,
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
      backgroundColor: "#78B8F1",
      headerColor: "#5088BA",
      initialX: 681,
      initialY: 226,
      zIndex: 11,
      content: (
        <div className="space-y-5">
          <div className="space-y-1">
            <p className="text-black text-base leading-6">I had </p>
            <div className="space-y-1">
              <p className="text-[#101828] font-bold text-base leading-6">
                dice carrying necklaces
              </p>
              <p className="text-[#101828] font-bold text-base leading-6">
                made for me by a jeweler.
              </p>
            </div>
            <p className="text-black text-base leading-6">
              Sometimes a roll makes the decision, and sometimes it just reveals
              the answer you already know.
            </p>
          </div>
          <div>
            <a
              href="#"
              className="text-[#101828] underline text-base leading-6"
            >
              Check them out here!
            </a>
          </div>
        </div>
      ),
    },
    {
      id: "sticky3",
      backgroundColor: "#F168AA",
      headerColor: "#EB2682",
      initialX: 600,
      initialY: 201,
      zIndex: 12,
      content: (
        <div className="space-y-0">
          <p className="text-black text-base leading-6">
            The moment I cease running experiments on my life is when the true
            experiment begins.{" "}
          </p>
          <div className="space-y-1">
            <p className="text-[#101828] font-bold text-base leading-6">
              What if all
            </p>
            <p className="text-[#101828] font-bold text-base leading-6">
              my searching was merely the cosmos teaching me
            </p>
          </div>
          <p className="text-black text-base leading-6">
            {" "}
            how to be still enough to receive what was already mine? The dice
            roll themselves when I am truly present.
          </p>
        </div>
      ),
    },
  ]);

  const [nextZIndex, setNextZIndex] = useState(100);

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
                <span className="flex-shrink-0">•</span>
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
    } else if (type === "Works") {
      bgColor = "#FFFFFF";
      headerColor = "#FFFFFF";
      windowContent = (
        <div className="bg-white h-full overflow-y-auto">
          {/* Project 1 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">
                🛒
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Aisles Online Grocery Shopping Experience
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  🏪
                </div>
                <span className="truncate">Retail</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">2024</span>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">
                VC
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Early Stage Venture Capital Fund
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  $
                </div>
                <span className="truncate">Fintech</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">Active</span>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">
                🌐
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-lg font-normal text-black leading-tight mb-2 truncate">
                Decentralized Social Media Platform
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  ⚡
                </div>
                <span className="truncate">Blockchain</span>
                <span className="flex-shrink-0">•</span>
                <span className="truncate">Beta</span>
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
      width: type === "Articles" || type === "Works" ? 500 : 300,
      height: type === "Articles" || type === "Works" ? 400 : 300,
      zIndex: nextZIndex,
      content: windowContent,
    };
    setOpenWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-desktop-blue to-blue-800 overflow-hidden relative">
      {/* Header */}
      <header className="h-12 bg-white border-b-2 border-black flex items-center justify-between px-2 md:px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-600 rounded-sm flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="md:w-6 md:h-6"
            >
              <path
                d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4l-1.5 4c0 1.5 1 2.5 2.5 2.5h1v1.5c0 1 1 2 2 2h3c1 0 2-1 2-2V18h1c1.5 0 2.5-1 2.5-2.5l-1.5-4c1-1 1.5-2.5 1.5-4 0-3.5-2.5-6-6-6z"
                fill="white"
              />
              <circle cx="10" cy="7" r="1" fill="black" />
              <circle cx="14" cy="7" r="1" fill="black" />
              <path
                d="M8 10c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5"
                stroke="black"
                strokeWidth="1"
                fill="none"
              />
              <ellipse cx="12" cy="16" rx="4" ry="2" fill="white" />
              <path
                d="M8 16c0-1 1.5-2 4-2s4 1 4 2"
                stroke="green"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
          <span className="hidden sm:block text-black font-normal text-[14px] md:text-[17px] leading-6">
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

          {/* Instagram */}
          <button className="text-desktop-blue hover:opacity-80 p-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="md:w-6 md:h-6"
            >
              <path
                d="M12.0008 9.49996C10.6197 9.49996 9.50081 10.6192 9.50081 12C9.50081 13.381 10.6201 14.5 12.0008 14.5C13.3819 14.5 14.5008 13.3807 14.5008 12C14.5008 10.6189 13.3816 9.49996 12.0008 9.49996ZM12.0008 7.83329C14.3012 7.83329 16.1675 9.69754 16.1675 12C16.1675 14.3004 14.3032 16.1666 12.0008 16.1666C9.70042 16.1666 7.83415 14.3024 7.83415 12C7.83415 9.69957 9.6984 7.83329 12.0008 7.83329ZM17.4175 7.62425C17.4175 8.19934 16.9502 8.66593 16.3758 8.66593C15.8007 8.66593 15.3342 8.19863 15.3342 7.62425C15.3342 7.04988 15.8014 6.58329 16.3758 6.58329C16.9494 6.58257 17.4175 7.04988 17.4175 7.62425ZM12.0008 5.33329C9.93875 5.33329 9.60265 5.33875 8.64356 5.38146C7.99012 5.41213 7.55211 5.50002 7.14513 5.65802C6.78346 5.79828 6.52257 5.96578 6.2446 6.24375C5.96556 6.52279 5.79836 6.78298 5.65866 7.14482C5.5003 7.55273 5.41244 7.99005 5.38231 8.64258C5.33919 9.56263 5.33415 9.88417 5.33415 12C5.33415 14.062 5.33961 14.3981 5.38231 15.3571C5.413 16.0103 5.501 16.449 5.65861 16.855C5.79925 17.2171 5.96708 17.4786 6.24371 17.7553C6.52386 18.035 6.78482 18.2028 7.14322 18.3411C7.55516 18.5004 7.9929 18.5884 8.64343 18.6185C9.56348 18.6615 9.88502 18.6666 12.0008 18.6666C14.0629 18.6666 14.399 18.6611 15.358 18.6185C16.0097 18.5879 16.4487 18.4996 16.8558 18.3421C17.217 18.2019 17.4793 18.0335 17.7562 17.757C18.0363 17.4765 18.2037 17.2161 18.3422 16.8569C18.5011 16.4465 18.5892 16.0081 18.6193 15.3574C18.6624 14.4373 18.6675 14.1157 18.6675 12C18.6675 9.93789 18.662 9.6018 18.6193 8.64277C18.5887 7.99084 18.5004 7.5512 18.3427 7.14428C18.2028 6.78361 18.0347 6.52192 17.757 6.24375C17.4775 5.96425 17.218 5.7974 16.8559 5.65781C16.4483 5.49958 16.0103 5.41159 15.3582 5.38147C14.4382 5.33833 14.1166 5.33329 12.0008 5.33329ZM12.0008 3.66663C14.2647 3.66663 14.5473 3.67496 15.4362 3.71663C16.323 3.7576 16.9279 3.89788 17.4592 4.10413C18.0084 4.31593 18.4723 4.60204 18.9355 5.06523C19.398 5.52843 19.6842 5.99371 19.8967 6.54163C20.1022 7.07218 20.2425 7.67773 20.2842 8.56454C20.3237 9.45343 20.3342 9.73607 20.3342 12C20.3342 14.2639 20.3258 14.5465 20.2842 15.4354C20.2432 16.3222 20.1022 16.927 19.8967 17.4583C19.6848 18.0076 19.398 18.4715 18.9355 18.9347C18.4723 19.3972 18.0063 19.6833 17.4592 19.8958C16.9279 20.1014 16.323 20.2416 15.4362 20.2833C14.5473 20.3229 14.2647 20.3333 12.0008 20.3333C9.73692 20.3333 9.45428 20.325 8.5654 20.2833C7.67859 20.2423 7.07442 20.1014 6.54248 19.8958C5.99386 19.684 5.52928 19.3972 5.06609 18.9347C4.6029 18.4715 4.31748 18.0055 4.10498 17.4583C3.89873 16.927 3.75915 16.3222 3.71748 15.4354C3.6779 14.5465 3.66748 14.2639 3.66748 12C3.66748 9.73607 3.67581 9.45343 3.71748 8.56454C3.75845 7.67704 3.89873 7.07288 4.10498 6.54163C4.31678 5.99302 4.6029 5.52843 5.06609 5.06523C5.52928 4.60204 5.99456 4.31663 6.54248 4.10413C7.07373 3.89788 7.6779 3.75829 8.5654 3.71663C9.45428 3.67704 9.73692 3.66663 12.0008 3.66663Z"
                fill="#5656E9"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Background with grid pattern */}
      <div className="absolute inset-0 top-12 overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8f348fdc69db5785ea51e7176e10e2c1f5ce835?width=4608"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Main Desktop Area */}
      <main className="relative h-[calc(100vh-48px)] overflow-hidden">
        {/* Desktop Icons - First Column */}
        <div
          className="absolute z-20"
          style={{ left: "calc(8px + 2vw)", top: "calc(16px + 2vw)" }}
        >
          <div className="grid grid-cols-2 gap-1 sm:gap-2 md:grid-cols-1 md:gap-4">
            <DesktopIcon
              icon={<WorksIcon />}
              label="Works"
              onClick={() => openNewWindow("Works")}
              className="scale-75 md:scale-100"
            />
            <DesktopIcon
              icon={<ContactIcon />}
              label="Contact Me"
              onClick={() => openNewWindow("Contact Me")}
              className="scale-75 md:scale-100"
            />
            <DesktopIcon
              icon={<ArticlesIcon />}
              label="Read"
              onClick={() => openNewWindow("Articles")}
              className="scale-75 md:scale-100"
            />
            <DesktopIcon
              icon={<AboutIcon />}
              label="About"
              onClick={() => openNewWindow("About")}
              className="scale-75 md:scale-100"
            />
          </div>
        </div>

        {/* Desktop Icons - Second Column (Playlist) */}
        <div
          className="absolute z-20"
          style={{ left: "calc(180px + 2vw)", top: "calc(16px + 2vw)" }}
        >
          <DesktopIcon
            icon={<PlaylistIcon />}
            label="Listen"
            onClick={() => openNewWindow("Playlist")}
            className="scale-75 md:scale-100"
          />
        </div>

        {/* Recycling Icon - Lower Right */}
        <div
          className="absolute z-20"
          style={{ bottom: "calc(16px + 2vw)", right: "calc(8px + 2vw)" }}
        >
          <DesktopIcon
            icon={<RecyclingIcon />}
            label="Recycling Bin"
            onClick={() => openNewWindow("Recycling Bin")}
            className="scale-75 md:scale-100"
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
                : window.id.startsWith("Works")
                  ? "Works"
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
  );
}
