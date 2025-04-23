// help-page.tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, X, Home, Search, ArrowLeft, ArrowRight, Printer } from "lucide-react"
import { HelpContent } from "./help-page-content"; // Import the content

interface HelpPageProps {
  isOpen: boolean
  onClose: () => void
}

// Helper function to create TOC links that update the state
const createNavLink = (sectionId: string, label: string, activeSection: string, setActiveSection: (section: string) => void, isSubItem = false) => {
  const isActive = activeSection === sectionId;
  const textClass = isSubItem ? "text-[11px]" : "text-[12px]";
  const activeClass = isActive ? "font-bold text-[#3366cc]" : "";
  const mbClass = isSubItem ? "mb-1" : "";

  // Use button for accessibility and clear click handling
  return (
    <button
      className={`${textClass} w-full text-left ${activeClass} ${mbClass} hover:underline`}
      onClick={() => setActiveSection(sectionId)}
      aria-current={isActive ? "page" : undefined} // Indicate active state for screen readers
    >
      {label}
    </button>
  );
};

// Helper function to create Section Toggles
const createSectionToggle = (sectionId: string, label: string, expandedSections: Record<string, boolean>, toggleSection: (section: string) => void) => {
 return (
    <button
      className="text-[12px] w-full text-left flex items-center font-medium" // Added font-medium for slight emphasis
      onClick={() => toggleSection(sectionId)}
      aria-expanded={expandedSections[sectionId]} // Accessibility for expanded state
    >
      {expandedSections[sectionId] ? (
        <ChevronDown className="h-3 w-3 mr-1 flex-shrink-0" /> // Added flex-shrink-0
      ) : (
        <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" /> // Added flex-shrink-0
      )}
      <span className="flex-grow">{label}</span> {/* Allow label to take space */}
    </button>
  );
}

export default function HelpPage({ isOpen, onClose }: HelpPageProps) {
  const [mounted, setMounted] = useState(false)
  // Default to introduction or check hash on load
  const [activeSection, setActiveSection] = useState<string>("introduction")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "getting-started": true, // Keep Getting Started open initially
    "dithering-algorithms": false,
    "color-quantization": false,
    "image-adjustments": false,
    "batch-processing": false, // Consider hiding if not implemented
    "advanced-features": false,
  })
   const [searchTerm, setSearchTerm] = useState(""); // State for search input

  useEffect(() => {
    setMounted(true);
    // Optional: Handle hash changes to sync activeSection, or initial load hash
    const handleHashChange = () => {
       const hash = window.location.hash.substring(1);
       if (hash && HelpContent[hash as keyof typeof HelpContent]) {
          setActiveSection(hash);
          // Optionally expand parent section if needed
       }
    }
    // Set initial state from hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);

  }, [])

   // Update hrefs in the HelpContent dynamically if needed, or handle clicks globally
   useEffect(() => {
    const contentArea = document.getElementById("help-content-area");
    if (!contentArea) return;

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        event.preventDefault(); // Prevent default browser jump
        const sectionId = target.getAttribute('href')?.substring(1);
        if (sectionId && HelpContent[sectionId as keyof typeof HelpContent]) {
          setActiveSection(sectionId);
          // Update URL hash manually if desired
          // window.location.hash = sectionId;

          // Optionally, find and expand the parent section
           for (const parentSection in expandedSections) {
               // Simple check, might need refinement based on actual section nesting structure
               if (Object.keys(HelpContent).some(key => key.startsWith(parentSection.split('-')[0]) && key === sectionId)) {
                    // Check if section belongs to this parent and expand if collapsed
                    if (!expandedSections[parentSection]) {
                         toggleSection(parentSection);
                    }
                    break; // Assume only one parent
               }
           }
        }
      }
    };

    contentArea.addEventListener('click', handleLinkClick);
    return () => contentArea.removeEventListener('click', handleLinkClick);

  }, [activeSection, expandedSections]); // Re-attach listener if activeSection changes? Maybe not needed.

  if (!mounted || !isOpen) return null

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Basic search function (filters TOC items - could be improved)
  const filterContentKeys = (keys: string[], term: string): string[] => {
      if (!term.trim()) return keys;
      const lowerTerm = term.toLowerCase();
      // Very basic search: checks if label contains term
      // A better search would check content as well
      return keys.filter(key =>
          key.toLowerCase().includes(lowerTerm) ||
          (HelpContent[key as keyof typeof HelpContent]?.toString() || '').toLowerCase().includes(lowerTerm) // Very crude content search
      );
  };

  // Filtered keys for TOC (simple example)
  // Note: This simple filter won't work well with the nested structure easily.
  // A more complex approach would be needed for effective TOC filtering.
  // const displayedKeys = filterContentKeys(Object.keys(HelpContent), searchTerm);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"> {/* Added backdrop-blur */}
      <div className="relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[800px] bg-[#f0f0f0] border-2 border-[#999999] flex flex-col shadow-2xl"> {/* Added max sizes and shadow */}
        {/* Header */}
        <div className="bg-[#d8d8d8] border-b border-[#999999] p-2 flex items-center justify-between flex-shrink-0">
           {/* ... Header content (Title, buttons) ... */}
            <div className="flex items-center">
             <div className="text-[16px] font-bold uppercase tracking-[1px] mr-4">DIETER Help System</div>
             <div className="text-[12px] text-[#666666]">v1.0</div>
           </div>
           <div className="flex items-center gap-1"> {/* Reduced gap slightly */}
             {/* Add onClick handlers for navigation if history management is implemented */}
             <button title="Home" onClick={() => setActiveSection("introduction")} className="bg-[#e8e8e8] border border-[#999999] p-1 hover:bg-[#f5f5f5] active:bg-[#e0e0e0]"> <Home className="h-4 w-4" /></button>
             <button title="Back (Not Implemented)" disabled className="bg-[#e8e8e8] border border-[#999999] p-1 text-gray-400 cursor-not-allowed"><ArrowLeft className="h-4 w-4" /></button>
             <button title="Forward (Not Implemented)" disabled className="bg-[#e8e8e8] border border-[#999999] p-1 text-gray-400 cursor-not-allowed"><ArrowRight className="h-4 w-4" /></button>
             <button title="Print" onClick={() => window.print()} className="bg-[#e8e8e8] border border-[#999999] p-1 hover:bg-[#f5f5f5] active:bg-[#e0e0e0]"><Printer className="h-4 w-4" /></button>
             <button title="Close" onClick={onClose} className="bg-[#e8e8e8] border border-[#999999] p-1 hover:bg-[#f5f5f5] active:bg-[#e0e0e0]"><X className="h-4 w-4" /></button>
           </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Table of Contents */}
           <div className="w-[280px] border-r border-[#999999] bg-[#e8e8e8] overflow-y-auto flex-shrink-0"> {/* Increased width slightly */}
             <div className="p-2 border-b border-[#999999] bg-[#d0d0d0] sticky top-0 z-10"> {/* Sticky header */}
               <div className="text-[12px] uppercase font-bold">Contents</div>
             </div>

              {/* TOC Search Bar */}
               <div className="p-2 border-b border-[#999999]">
                   <div className="relative">
                       <input
                           type="text"
                           placeholder="Filter topics..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full border border-[#999999] p-1 text-[11px] pl-6" // Added padding for icon
                       />
                       <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-[#666666]" />
                   </div>
               </div>


             <div className="p-2">
                {/* Use helper functions to generate TOC */}
                 <div className="mb-2">
                    {createNavLink("introduction", "Introduction to DIETER", activeSection, setActiveSection)}
                 </div>

                 <div className="mb-2">
                    {createSectionToggle("getting-started", "Getting Started", expandedSections, toggleSection)}
                     {expandedSections["getting-started"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1"> {/* Slightly lighter border */}
                         {createNavLink("uploading-images", "Uploading Images", activeSection, setActiveSection, true)}
                         {createNavLink("interface-overview", "Interface Overview", activeSection, setActiveSection, true)}
                         {createNavLink("basic-workflow", "Basic Workflow", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>

                 <div className="mb-2">
                     {createSectionToggle("dithering-algorithms", "Dithering Algorithms", expandedSections, toggleSection)}
                     {expandedSections["dithering-algorithms"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1">
                         {createNavLink("error-diffusion", "Error Diffusion Methods", activeSection, setActiveSection, true)}
                         {createNavLink("ordered-dithering", "Ordered Dithering", activeSection, setActiveSection, true)}
                         {createNavLink("other-methods", "Other Methods", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>

                 <div className="mb-2">
                     {createSectionToggle("color-quantization", "Color Quantization", expandedSections, toggleSection)}
                     {expandedSections["color-quantization"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1">
                         {createNavLink("median-cut", "Median Cut", activeSection, setActiveSection, true)}
                         {createNavLink("k-means", "K-Means Clustering", activeSection, setActiveSection, true)}
                         {createNavLink("octree", "Octree Quantization", activeSection, setActiveSection, true)}
                         {createNavLink("neuquant", "NeuQuant Algorithm", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>

                  <div className="mb-2">
                     {createSectionToggle("image-adjustments", "Image Adjustments", expandedSections, toggleSection)}
                     {expandedSections["image-adjustments"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1">
                         {createNavLink("brightness-contrast", "Brightness & Contrast", activeSection, setActiveSection, true)}
                         {createNavLink("saturation", "Saturation / Grayscale", activeSection, setActiveSection, true)}
                         {createNavLink("blur-sharpen", "Blur & Sharpen", activeSection, setActiveSection, true)}
                         {createNavLink("other-adjustments", "Other Effects (Invert, Posterize)", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>

                 {/* Conditionally render Batch Processing if feature exists */}
                 {/*
                 <div className="mb-2">
                     {createSectionToggle("batch-processing", "Batch Processing", expandedSections, toggleSection)}
                     {expandedSections["batch-processing"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1">
                         {createNavLink("batch-overview", "Batch Processing Overview", activeSection, setActiveSection, true)}
                         {createNavLink("batch-workflow", "Batch Workflow", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>
                 */}


                 <div className="mb-2">
                     {createSectionToggle("advanced-features", "Advanced Features", expandedSections, toggleSection)}
                     {expandedSections["advanced-features"] && (
                       <div className="pl-4 mt-1 border-l border-[#b0b0b0] ml-1 space-y-1">
                         {createNavLink("custom-palettes", "Custom Palettes", activeSection, setActiveSection, true)}
                         {createNavLink("histogram", "Histogram Analysis", activeSection, setActiveSection, true)}
                         {createNavLink("processing-log", "Processing Log", activeSection, setActiveSection, true)}
                       </div>
                     )}
                 </div>

                 <div className="mb-2">
                     {createNavLink("troubleshooting", "Troubleshooting", activeSection, setActiveSection)}
                 </div>

             </div>
           </div>

          {/* Main content area */}
           <div id="help-content-area" className="flex-1 overflow-y-auto bg-white"> {/* Changed background */}
             <div className="p-4 md:p-6"> {/* Added padding */}
                {/* Content sections - Render dynamically */}
                 {HelpContent[activeSection as keyof typeof HelpContent] ? (
                   HelpContent[activeSection as keyof typeof HelpContent]
                 ) : (
                   // Fallback content (e.g., show introduction or a not found message)
                   HelpContent["introduction"]
                 )}
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
