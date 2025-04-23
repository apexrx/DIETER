// help-page-content.tsx
import React from "react";

export const HelpContent: Record<string, React.ReactNode> = {
  // --- Existing Sections (with ordered-dithering completed) ---
  "uploading-images": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Uploading Images
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          DIETER supports various methods for uploading and importing images for processing. This section covers all the ways you can get your images into the application.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Supported File Formats</h2>
        <p className="text-[12px] leading-tight mb-2">
          DIETER supports the following image file formats:
        </p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>PNG (.png) - Recommended for highest quality</li>
          <li>JPEG/JPG (.jpg, .jpeg) - Common photographic format</li>
          <li>GIF (.gif) - For simple graphics (first frame only for animated GIFs)</li>
          <li>WebP (.webp) - Modern format with good compression</li>
          <li>BMP (.bmp) - Uncompressed bitmap format</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
          <h3 className="text-[12px] font-bold uppercase mb-1">Upload Methods</h3>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li><strong>Drag and Drop:</strong> Drag files from your computer directly onto the drop zone</li>
            <li><strong>File Browser:</strong> Click the "Upload" button to open your system's file browser</li>
            <li><strong>Paste:</strong> Copy an image to clipboard and press Ctrl+V (or Cmd+V on Mac)</li>
            <li><strong>URL Import:</strong> Enter a web URL to an image in the URL field</li>
          </ul>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
          <h3 className="text-[12px] font-bold uppercase mb-1">Size Limitations</h3>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li><strong>Maximum file size:</strong> 10MB</li>
            <li><strong>Maximum dimensions:</strong> 4096 x 4096 pixels</li>
            <li><strong>Recommended size:</strong> 800-1200 pixels on longest side for optimal performance</li>
            <li>Larger images will be automatically resized</li>
          </ul>
        </div>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Important
        </h3>
        <p className="text-[11px] leading-tight">
          For best results, use high-quality source images. Low-resolution or already compressed images may not produce optimal dithering results. PNG format is recommended for highest quality.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step-by-Step Upload Guide</h2>
        <ol className="list-decimal pl-5 text-[12px] space-y-2">
          <li>
            <strong>Prepare your image:</strong> Ensure your image meets the size requirements and is in a supported format.
          </li>
          <li>
            <strong>Access DIETER:</strong> Open the application in your web browser.
          </li>
          <li>
            <strong>Upload your image:</strong> Either drag and drop your image onto the designated area, or click the "Upload" button to browse for your file.
          </li>
          <li>
            <strong>Wait for processing:</strong> The image will be uploaded and prepared for editing. A thumbnail will appear in the image panel once ready.
          </li>
          <li>
            <strong>Confirm successful upload:</strong> The image will appear in the main preview area, and the editing tools will become available.
          </li>
        </ol>
      </div>

      <div className="text-[12px] mb-4">
         {/* Note: The href here should ideally trigger setActiveSection('basic-workflow') */}
        <p className="mb-2">
          Once your image is uploaded, you can proceed to the{" "}
          <a
            href="#basic-workflow"
            className="text-[#3366cc] underline"
          >
            Basic Workflow
          </a>{" "}
          section to learn how to process your image.
        </p>
      </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

  "interface-overview": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Interface Overview
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          DIETER features a comprehensive interface designed for efficient image processing and dithering. This section provides an overview of the main interface elements and their functions.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Main Interface Sections</h2>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8] mb-2">
          <h3 className="text-[12px] font-bold mb-1">1. Image Preview Area</h3>
          <p className="text-[11px] leading-tight">
            The central area where your image is displayed. This shows the current state of your image with all applied effects and dithering. You can zoom in/out using the controls or mouse wheel.
          </p>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8] mb-2">
          <h3 className="text-[12px] font-bold mb-1">2. Control Panel</h3>
          <p className="text-[11px] leading-tight">
            Located on the right side, this panel contains all the controls for adjusting dithering parameters, color quantization, and image adjustments. It's organized into collapsible sections for easy navigation.
          </p>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8] mb-2">
          <h3 className="text-[12px] font-bold mb-1">3. Toolbar</h3>
          <p className="text-[11px] leading-tight">
            Located at the top of the interface, the toolbar provides quick access to common functions like opening files, saving results, undoing/redoing changes, and accessing help.
          </p>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8] mb-2">
          <h3 className="text-[12px] font-bold mb-1">4. Palette Display</h3>
          <p className="text-[11px] leading-tight">
            Shows the current color palette being used for dithering. You can click on individual colors to edit them or import/export palettes.
          </p>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
          <h3 className="text-[12px] font-bold mb-1">5. Status Bar</h3>
          <p className="text-[11px] leading-tight">
            Located at the bottom of the interface, displays information about the current image (dimensions, file size), processing status, and zoom level.
          </p>
        </div>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Control Panel Sections</h2>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#d0d0d0]">
              <th className="border border-[#999999] p-1 text-left">Section</th>
              <th className="border border-[#999999] p-1 text-left">Description</th>
              <th className="border border-[#999999] p-1 text-left">Key Controls</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1"><strong>Dithering</strong></td>
              <td className="border border-[#999999] p-1">Controls for dithering algorithm selection and parameters</td>
              <td className="border border-[#999999] p-1">Algorithm dropdown, Diffusion Strength, Pattern Size</td>
            </tr>
            <tr className="bg-[#e8e8e8]">
              <td className="border border-[#999999] p-1"><strong>Color Quantization</strong></td>
              <td className="border border-[#999999] p-1">Settings for color reduction and palette generation</td>
              <td className="border border-[#999999] p-1">Algorithm selector, Color Count, Palette selector</td>
            </tr>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1"><strong>Image Adjustments</strong></td>
              <td className="border border-[#999999] p-1">Pre-processing adjustments for the input image</td>
              <td className="border border-[#999999] p-1">Brightness, Contrast, Saturation, Blur/Sharpen sliders</td>
            </tr>
            <tr className="bg-[#e8e8e8]">
              <td className="border border-[#999999] p-1"><strong>Histogram</strong></td>
              <td className="border border-[#999999] p-1">Color distribution analysis of the image</td>
              <td className="border border-[#999999] p-1">Channel selector, Scale controls</td>
            </tr>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1"><strong>Processing Log</strong></td>
              <td className="border border-[#999999] p-1">Record of operations performed on the image</td>
              <td className="border border-[#999999] p-1">Clear Log, Copy Log, Log Level selector</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Tip
        </h3>
        <p className="text-[11px] leading-tight">
          You can customize the interface layout by collapsing sections you're not currently using. This gives you more screen space for the image preview. Double-click on any panel header to collapse or expand it.
        </p>
      </div>

      <div className="text-[12px] mb-4">
        <p className="mb-2">
          Now that you're familiar with the interface, proceed to the{" "}
          {/* Note: The href here should ideally trigger setActiveSection('basic-workflow') */}
          <a
            href="#basic-workflow"
            className="text-[#3366cc] underline"
          >
            Basic Workflow
          </a>{" "}
          section to learn how to process your images.
        </p>
      </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

  "basic-workflow": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Basic Workflow
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          This section outlines the basic workflow for processing an image in DIETER, from uploading to saving the final result.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 1: Upload an Image</h2>
         {/* Note: The href here should ideally trigger setActiveSection('uploading-images') */}
        <p className="text-[12px] leading-tight mb-2">
          Begin by uploading an image using one of the methods described in the{" "}
          <a href="#uploading-images" className="text-[#3366cc] underline">Uploading Images</a> section.
        </p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>Drag and drop an image onto the drop zone</li>
          <li>Click the "Upload" button to browse for a file</li>
          <li>Paste an image from clipboard (Ctrl+V / Cmd+V)</li>
          <li>Import from a URL</li>
        </ul>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 2: Adjust Image (Optional)</h2>
        <p className="text-[12px] leading-tight mb-2">
          Before applying dithering, you may want to adjust the image to optimize results:
        </p>
        <ol className="list-decimal pl-5 text-[12px] space-y-1">
          <li>Open the "Image Adjustments" panel</li>
          <li>Adjust brightness and contrast to enhance details</li>
          <li>Modify saturation to control color intensity</li>
          <li>Apply blur to reduce noise or sharpen to enhance details</li>
        </ol>
        <p className="text-[12px] leading-tight mt-2">
          These adjustments can significantly impact the quality of the dithering result. High contrast images often produce more distinct dithering patterns.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 3: Select Color Quantization Method</h2>
        <p className="text-[12px] leading-tight mb-2">
          Color quantization reduces the number of colors in your image:
        </p>
        <ol className="list-decimal pl-5 text-[12px] space-y-1">
          <li>Open the "Color Quantization" panel</li>
          <li>Choose a quantization algorithm (Median Cut, K-Means, Octree, or NeuQuant)</li>
          <li>Set the desired number of colors using the "Color Count" slider</li>
           {/* Note: Link target 'custom-palettes' might be under Advanced Features */}
          <li>Alternatively, select a predefined palette or define a <a href="#custom-palettes" className="text-[#3366cc] underline">Custom Palette</a></li>
        </ol>
        <p className="text-[12px] leading-tight mt-2">
          The choice of palette and color count dramatically affects the final appearance of your dithered image.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 4: Apply Dithering</h2>
        <p className="text-[12px] leading-tight mb-2">
          Now apply the dithering effect:
        </p>
        <ol className="list-decimal pl-5 text-[12px] space-y-1">
          <li>Open the "Dithering" panel</li>
           {/* Note: Link targets 'error-diffusion' and 'ordered-dithering' are under Dithering Algorithms */}
          <li>Select a dithering algorithm (e.g., <a href="#error-diffusion" className="text-[#3366cc] underline">Error Diffusion</a> or <a href="#ordered-dithering" className="text-[#3366cc] underline">Ordered Dithering</a>)</li>
          <li>Adjust the "Diffusion Strength" slider (for error diffusion)</li>
          <li>Adjust the "Pattern Size" or other relevant controls (for ordered dithering)</li>
        </ol>
        <p className="text-[12px] leading-tight mt-2">
          The image preview will update in real-time as you adjust these settings.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Recommended Combinations
        </h3>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#e8e8e8]">
              <th className="border border-[#999999] p-1 text-left">Image Type</th>
              <th className="border border-[#999999] p-1 text-left">Recommended Settings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#999999] p-1">Photographs</td>
              <td className="border border-[#999999] p-1">Floyd-Steinberg dithering with 16-32 colors using K-Means quantization</td>
            </tr>
            <tr>
              <td className="border border-[#999999] p-1">Pixel Art</td>
              <td className="border border-[#999999] p-1">Bayer ordered dithering with a predefined retro palette (e.g., C64, NES)</td>
            </tr>
            <tr>
              <td className="border border-[#999999] p-1">Text/UI Elements</td>
              <td className="border border-[#999999] p-1">Atkinson dithering with high contrast and limited colors (8-16)</td>
            </tr>
            <tr>
              <td className="border border-[#999999] p-1">Artistic Effects</td>
              <td className="border border-[#999999] p-1">Stucki or Jarvis dithering with custom palettes and high diffusion strength</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 5: Fine-tune Results</h2>
        <p className="text-[12px] leading-tight mb-2">
          Experiment with different combinations of settings to achieve your desired result:
        </p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>Try different dithering algorithms to see which works best for your image</li>
          <li>Adjust the color count to find the optimal balance between detail and stylization</li>
           {/* Note: Link target 'histogram' might be under Advanced Features */}
          <li>Use the <a href="#histogram" className="text-[#3366cc] underline">Histogram</a> to analyze color distribution</li>
           {/* Note: Link target 'processing-log' might be under Advanced Features */}
          <li>Check the <a href="#processing-log" className="text-[#3366cc] underline">Processing Log</a> for information</li>
        </ul>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Step 6: Save Your Result</h2>
        <p className="text-[12px] leading-tight mb-2">
          Once you're satisfied with the result:
        </p>
        <ol className="list-decimal pl-5 text-[12px] space-y-1">
          <li>Click the "Save" / "Download" button in the toolbar</li>
          <li>Choose a file format (PNG recommended for highest quality)</li>
          <li>Your browser will prompt you to save the file</li>
          {/* Removed Optional Adjust Export settings as it wasn't a primary feature asked for */}
        </ol>
      </div>

      <div className="text-[12px] mb-4">
        <p className="mb-2">
          For more advanced techniques, explore the{" "}
          {/* Note: The href here should ideally trigger setActiveSection and expand 'advanced-features' */}
          <a
            href="#advanced-features" // This might need a specific sub-section like #custom-palettes
            className="text-[#3366cc] underline"
          >
            Advanced Features
          </a>{" "}
          sections.
        </p>
      </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

  "ordered-dithering": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Ordered Dithering
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          Ordered dithering is a class of dithering algorithms that use a predetermined threshold map (also called a dither matrix) to determine whether to place a dot at each pixel location. Unlike error diffusion methods, ordered dithering processes each pixel independently, making it faster and more suitable for certain applications.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Bayer Dithering</h2>
        <p className="text-[12px] leading-tight mb-2">
          Bayer dithering is the most common form of ordered dithering. It uses a matrix of thresholds arranged in a specific pattern to create a regular, grid-like dithering effect. DIETER supports 2x2, 4x4, and 8x8 Bayer matrices.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
            <h3 className="text-[12px] font-bold mb-1">2x2 Bayer Matrix</h3>
            <pre className="text-[11px] font-mono bg-white p-1 border border-[#cccccc]">
              {`0  2\n3  1`}
            </pre>
          </div>
          <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
            <h3 className="text-[12px] font-bold mb-1">4x4 Bayer Matrix</h3>
            <pre className="text-[11px] font-mono bg-white p-1 border border-[#cccccc]">
              {` 0  8  2 10\n12  4 14  6\n 3 11  1  9\n15  7 13  5`}
            </pre>
          </div>
        </div>
        <p className="text-[12px] leading-tight mt-2">
          Larger matrices (e.g., 8x8) create more subtle patterns with a greater number of apparent color levels. The "Pattern Size" control in DIETER often corresponds to the matrix size (e.g., 2 for 2x2, 4 for 4x4).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-[#999999] p-2 bg-[#e8e8e8]">
          <h2 className="text-[14px] font-bold mb-2">Characteristics</h2>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li><strong>Regular patterns:</strong> Creates consistent, repeating patterns</li>
            <li><strong>Speed:</strong> Faster than error diffusion methods</li>
            <li><strong>Parallelizable:</strong> Can be processed in parallel</li>
            <li><strong>Deterministic:</strong> Same input always produces same output</li>
            <li><strong>Retro aesthetic:</strong> Creates a distinctive "computer graphics" look</li>
          </ul>
        </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8]">
          <h2 className="text-[14px] font-bold mb-2">Best Applications</h2>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li><strong>Pixel art:</strong> Creates clean, consistent patterns</li>
            <li><strong>Retro gaming graphics:</strong> Authentic 8-bit/16-bit look</li>
            <li><strong>Print media:</strong> Predictable dot patterns</li>
            <li><strong>UI elements:</strong> Clean appearance for interface components</li>
            <li><strong>Animation:</strong> Prevents temporal artifacts ("pattern crawl") between frames</li>
          </ul>
        </div>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Other Ordered Dithering Methods in DIETER</h2>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#d0d0d0]">
              <th className="border border-[#999999] p-1 text-left">Method</th>
              <th className="border border-[#999999] p-1 text-left">Description</th>
              <th className="border border-[#999999] p-1 text-left">Characteristics</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1"><strong>Clustered-Dot</strong></td>
              <td className="border border-[#999999] p-1">Creates clusters of dots similar to traditional halftoning</td>
              <td className="border border-[#999999] p-1">Good for print simulation, mimics traditional printing techniques</td>
            </tr>
            <tr className="bg-[#e8e8e8]">
              <td className="border border-[#999999] p-1"><strong>Halftone</strong></td>
              <td className="border border-[#999999] p-1">Uses dot or line patterns of varying sizes based on brightness</td>
              <td className="border border-[#999999] p-1">Creates a newspaper, comic book, or screen print effect</td>
            </tr>
            {/* Add other ordered methods if available in the app, e.g., Blue Noise, Void-and-Cluster */}
             <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1"><strong>Blue Noise (Pattern)</strong></td>
              <td className="border border-[#999999] p-1">Uses a pre-generated blue noise texture as a threshold map</td>
              <td className="border border-[#999999] p-1">Reduces visible patterns compared to Bayer, more organic appearance, still fast</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Tip
        </h3>
        <p className="text-[11px] leading-tight">
          When using ordered dithering in DIETER, experiment with the "Pattern Size" or related controls (like Bayer matrix size selection). Larger patterns create more subtle dithering with more apparent color levels, while smaller patterns create a more pronounced, visible texture. Halftone patterns might have controls for dot/line size or angle.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Comparing Ordered Dithering vs. Error Diffusion</h2>
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#d0d0d0]">
              <th className="border border-[#999999] p-1 text-left">Aspect</th>
              <th className="border border-[#999999] p-1 text-left">Ordered Dithering</th>
              <th className="border border-[#999999] p-1 text-left">Error Diffusion</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1">Pattern</td>
              <td className="border border-[#999999] p-1">Regular, grid-like, repeating</td>
              <td className="border border-[#999999] p-1">Irregular, noise-like, organic</td>
            </tr>
            <tr className="bg-[#e8e8e8]">
              <td className="border border-[#999999] p-1">Processing Speed</td>
              <td className="border border-[#999999] p-1">Faster (parallelizable)</td>
              <td className="border border-[#999999] p-1">Slower (sequential)</td>
            </tr>
            <tr className="bg-[#f0f0f0]">
              <td className="border border-[#999999] p-1">Detail Preservation</td>
              <td className="border border-[#999999] p-1">Can obscure fine details with patterns</td>
              <td className="border border-[#999999] p-1">Generally better at preserving fine details</td>
            </tr>
            <tr className="bg-[#e8e8e8]">
             <td className="border border-[#999999] p-1">Artifacts</td>
             <td className="border border-[#999999] p-1">Obvious repeating patterns</td>
             <td className="border border-[#999999] p-1">Worm-like structures, less repetitive</td>
           </tr>
           <tr className="bg-[#f0f0f0]">
             <td className="border border-[#999999] p-1">Animation Suitability</td>
             <td className="border border-[#999999] p-1">Good (patterns are static relative to frame)</td>
             <td className="border border-[#999999] p-1">Can have temporal artifacts (crawling noise) if not handled carefully</td>
           </tr>
          </tbody>
        </table>
      </div>

      <div className="text-[12px] mb-4">
         <p className="mb-2">
           See the <a href="#error-diffusion" className="text-[#3366cc] underline">Error Diffusion Methods</a> section for details on those algorithms.
         </p>
       </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

  // --- New Sections ---

  "introduction": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Introduction to DIETER
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          DIETER (Digital Image Enhancement and Transformation for Effective Rendering) is an advanced, interactive web application designed for exploring and applying various image dithering techniques. It goes beyond simple color reduction, treating dithering as a creative tool for producing stylized, retro, or unique visual effects.
        </p>
        <p className="text-[12px] leading-tight mb-2">
          Dithering is a technique used in computer graphics to simulate color depth in images with a limited color palette. By strategically arranging pixels of the available colors, dithering creates the illusion of intermediate shades and tones, often resulting in a characteristic textured or patterned appearance.
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Key Features of DIETER</h2>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          <li>Wide range of Dithering Algorithms (Error Diffusion, Ordered, Random)</li>
          <li>Flexible Color Palette options (B&W, Grayscale, Retro Systems, Custom)</li>
          <li>Pre-Dithering Image Adjustments (Brightness, Contrast, Saturation, Effects)</li>
          <li>Real-time Preview of dithered results</li>
          <li>Adjustable Dithering Parameters (Strength, Pattern Size, Threshold)</li>
          <li>Output Scaling Control ("Dither Scale")</li>
          <li>Download dithered images (PNG format)</li>
          <li>Client-Side Processing (no server needed)</li>
          <li>Advanced tools like Histogram Analysis and Custom Palettes</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
          <h3 className="text-[12px] font-bold uppercase mb-1">Use Cases</h3>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li>Creating pixel art aesthetics</li>
            <li>Simulating retro computer/game graphics (CGA, EGA, Game Boy)</li>
            <li>Artistic image stylization</li>
            <li>Generating textures and patterns</li>
            <li>Preparing images for low-color displays (e-ink)</li>
            <li>Exploring digital art history techniques</li>
          </ul>
        </div>
        <div className="border border-[#999999] p-2 bg-[#f8f8f8]">
          <h3 className="text-[12px] font-bold uppercase mb-1">System Requirements</h3>
          <ul className="list-disc pl-4 text-[11px] space-y-1">
            <li>Modern web browser (Chrome, Firefox, Safari, Edge recommended)</li>
            <li>JavaScript enabled</li>
            <li>Sufficient RAM for image processing (4GB+ recommended)</li>
            <li>Screen resolution: 1024x768 or higher preferred</li>
          </ul>
        </div>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Using This Help System
        </h3>
        <p className="text-[11px] leading-tight">
          Use the Table of Contents on the left to navigate through different topics. Click on section headers (like "Getting Started") to expand or collapse them. Click on individual topics (like "Uploading Images") to view their content here.
        </p>
      </div>

      <div className="text-[12px] mb-4">
        <p className="mb-2">
          To get started with using the application, proceed to the{" "}
          <a href="#uploading-images" className="text-[#3366cc] underline">Uploading Images</a>{" "}
          section within "Getting Started".
        </p>
      </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

  "error-diffusion": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Error Diffusion Dithering Methods
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          Error diffusion is a class of dithering algorithms that process pixels sequentially (e.g., left-to-right, top-to-bottom). For each pixel, the algorithm finds the closest available color in the target palette. The difference between the original pixel's color and the chosen palette color (the "quantization error") is then distributed or "diffused" to neighboring pixels that have not yet been processed.
        </p>
        <p className="text-[12px] leading-tight mb-2">
          This process tends to preserve image detail better than ordered dithering and produces more organic, noise-like patterns. However, it is computationally more intensive and can sometimes produce unwanted visual artifacts ("worms").
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Common Error Diffusion Algorithms in DIETER</h2>
        <p className="text-[12px] leading-tight mb-2">
          DIETER includes several popular error diffusion algorithms, differing mainly in how they distribute the error:
        </p>
        <table className="w-full border-collapse text-[11px]">
         <thead>
           <tr className="bg-[#d0d0d0]">
             <th className="border border-[#999999] p-1 text-left">Algorithm</th>
             <th className="border border-[#999999] p-1 text-left">Error Distribution Pattern (X = Current Pixel)</th>
             <th className="border border-[#999999] p-1 text-left">Characteristics</th>
           </tr>
         </thead>
         <tbody>
           <tr className="bg-[#f0f0f0]">
             <td className="border border-[#999999] p-1"><strong>Floyd-Steinberg</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`   X   7/16\n3/16 5/16 1/16`}</td>
             <td className="border border-[#999999] p-1">Most common, good general purpose, relatively fast.</td>
           </tr>
           <tr className="bg-[#e8e8e8]">
             <td className="border border-[#999999] p-1"><strong>Jarvis-Judice-Ninke</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`     X   7/48 5/48\n3/48 5/48 7/48 5/48 3/48\n1/48 3/48 5/48 3/48 1/48`}</td>
             <td className="border border-[#999999] p-1">Diffuses error wider, smoother results, less structured noise, slower.</td>
           </tr>
           <tr className="bg-[#f0f0f0]">
             <td className="border border-[#999999] p-1"><strong>Stucki</strong></td>
              <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`     X   8/42 4/42\n2/42 4/42 8/42 4/42 2/42\n1/42 2/42 4/42 2/42 1/42`}</td>
             <td className="border border-[#999999] p-1">Similar to Jarvis but aims for cleaner edges, often perceived as sharper.</td>
           </tr>
           <tr className="bg-[#e8e8e8]">
             <td className="border border-[#999999] p-1"><strong>Atkinson</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`   X   1/8  1/8\n1/8 1/8  1/8\n    1/8`}</td>
             <td className="border border-[#999999] p-1">Developed for early Macs. Distributes less error, leading to higher contrast, potentially losing some detail but good for preserving shapes.</td>
           </tr>
           <tr className="bg-[#f0f0f0]">
             <td className="border border-[#999999] p-1"><strong>Burkes</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`     X   8/32 4/32\n2/32 4/32 8/32 4/32 2/32`}</td>
             <td className="border border-[#999999] p-1">Simplified Stucki/Jarvis, faster than them, good balance.</td>
           </tr>
           <tr className="bg-[#e8e8e8]">
             <td className="border border-[#999999] p-1"><strong>Sierra (Sierra-3)</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`     X   5/32 3/32\n2/32 4/32 5/32 4/32 2/32\n     2/32 3/32 2/32`}</td>
             <td className="border border-[#999999] p-1">Aims for fewer artifacts than Floyd-Steinberg.</td>
           </tr>
           <tr className="bg-[#f0f0f0]">
             <td className="border border-[#999999] p-1"><strong>Sierra-2</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{`   X   4/16 3/16\n1/16 2/16 3/16 2/16 1/16`}</td>
             <td className="border border-[#999999] p-1">Faster two-row version of Sierra.</td>
           </tr>
            <tr className="bg-[#e8e8e8]">
             <td className="border border-[#999999] p-1"><strong>Sierra-Lite</strong></td>
             <td className="border border-[#999999] p-1 font-mono whitespace-pre">{` X  2/4\n1/4 1/4`}</td>
             <td className="border border-[#999999] p-1">Very simple and fast, minimal diffusion.</td>
           </tr>
         </tbody>
        </table>
      </div>

      <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Diffusion Strength Control
        </h3>
        <p className="text-[11px] leading-tight">
          DIETER provides an "Error Diffusion Strength" slider (or similar control). This multiplies the error before it's distributed.
        </p>
         <ul className="list-disc pl-4 text-[11px] space-y-1 mt-1">
            <li><strong>100% (or 1.0):</strong> Standard behavior for the selected algorithm.</li>
            <li><strong>Less than 100%:</strong> Reduces the amount of diffused error, leading to a less noisy, potentially more posterized look, similar to Atkinson's effect.</li>
            <li><strong>More than 100%:</strong> Increases the diffused error, exaggerating the dithering pattern and potentially creating stronger textures or artifacts.</li>
         </ul>
          <p className="text-[11px] leading-tight mt-1">
             Experiment with this slider to fine-tune the appearance of the dither pattern.
          </p>
      </div>

      <div className="text-[12px] mb-4">
         <p className="mb-2">
           Compare these with methods described in the <a href="#ordered-dithering" className="text-[#3366cc] underline">Ordered Dithering</a> section.
         </p>
       </div>

      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

   "other-methods": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Other Dithering Methods
      </h1>

      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          Besides standard error diffusion and ordered dithering, DIETER may include other or experimental methods:
        </p>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Random / Stochastic Dithering</h2>
        <p className="text-[12px] leading-tight mb-2">
          This is one of the simplest forms. For each pixel, a random number is added to its brightness (or each color channel) before comparing it to a threshold (often 50%).
        </p>
         <ul className="list-disc pl-5 text-[12px] space-y-1">
            <li><strong>Characteristics:</strong> Produces a noisy, random dot pattern. No repeating structures like ordered dithering, no "worms" like error diffusion.</li>
            <li><strong>Controls:</strong> May have a "Threshold" or "Intensity" slider to control the likelihood of a dot appearing.</li>
            <li><strong>Use Cases:</strong> Creating simple noise textures, basic grayscale simulation.</li>
         </ul>
      </div>

      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Pattern Dithering (Optional)</h2>
        <p className="text-[12px] leading-tight mb-2">
          This involves replacing blocks of pixels with predefined patterns based on the average brightness or color of the block. It's less common in general-purpose tools but can create unique stylistic effects. DIETER might implement this in the future.
        </p>
      </div>

       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
        <h2 className="text-[14px] font-bold mb-2">Riemersma Dithering (Optional)</h2>
        <p className="text-[12px] leading-tight mb-2">
         An error-diffusion-like method that processes pixels along a Hilbert curve instead of scanlines. This can produce patterns with different structural characteristics compared to standard error diffusion. DIETER might implement this as an advanced option.
        </p>
      </div>

       <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
        <h3 className="text-[12px] font-bold mb-1 flex items-center">
          <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
            !
          </span>
          Experimentation
        </h3>
        <p className="text-[11px] leading-tight">
          The best way to understand these different methods is to apply them to various images and adjust their parameters. See how they interact with different palettes and image adjustments.
        </p>
      </div>


      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

   "median-cut": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Color Quantization: Median Cut
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           Color quantization is the process of reducing the number of distinct colors used in an image, usually with the intention that the new image should be as visually similar as possible to the original image. DIETER uses quantization to generate the palette for dithering when a predefined palette isn't selected.
         </p>
         <p className="text-[12px] leading-tight mb-2">
           The <strong>Median Cut</strong> algorithm is a classic quantization method. It works by:
         </p>
         <ol className="list-decimal pl-5 text-[12px] space-y-1">
            <li>Placing all the image's colors into a single 3D box (representing Red, Green, Blue dimensions).</li>
            <li>Finding the longest dimension (axis) of the box.</li>
            <li>Sorting the colors along that dimension.</li>
            <li>Splitting the box into two smaller boxes at the median color along that axis.</li>
            <li>Repeating steps 2-4 recursively on the smaller boxes until the desired number of boxes (palettes/colors) is reached.</li>
            <li>The final palette color for each box is typically the average of all the colors within that box.</li>
          </ol>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Characteristics</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Relatively simple and fast to compute.</li>
              <li>Generally produces good quality palettes that represent the original image's color distribution.</li>
              <li>Tends to divide color space based on density, giving more palette entries to more populated color regions.</li>
              <li>May sometimes create suboptimal splits if the color distribution is unusual.</li>
          </ul>
      </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "k-means": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Color Quantization: K-Means Clustering
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           <strong>K-Means Clustering</strong> is another popular algorithm for color quantization, based on finding clusters in the image's color data. It aims to partition the colors into K clusters (where K is the desired number of palette colors) such that each color belongs to the cluster with the nearest mean (cluster center).
         </p>
          <p className="text-[12px] leading-tight mb-2">The iterative process generally involves:</p>
         <ol className="list-decimal pl-5 text-[12px] space-y-1">
            <li>Initializing K cluster centers (e.g., randomly selecting K colors from the image).</li>
            <li>Assigning each color (pixel) in the image to its nearest cluster center (based on color distance).</li>
            <li>Recalculating the position of each cluster center by averaging all the colors assigned to it.</li>
            <li>Repeating steps 2 and 3 until the cluster centers stabilize (don't move significantly) or a maximum number of iterations is reached.</li>
            <li>The final positions of the K cluster centers become the colors in the generated palette.</li>
          </ol>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Characteristics</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Can often produce higher quality palettes than Median Cut, especially for images with distinct color groups.</li>
              <li>Computationally more expensive than Median Cut due to its iterative nature.</li>
              <li>The quality of the result can depend on the initial placement of cluster centers.</li>
              <li>Tends to find centers of dense color regions.</li>
          </ul>
      </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "octree": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Color Quantization: Octree
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           The <strong>Octree</strong> quantization algorithm uses a tree data structure to represent the color space. An octree node can have up to eight children, corresponding to dividing the 3D color space (RGB) into eight octants.
         </p>
          <p className="text-[12px] leading-tight mb-2">The process typically works as follows:</p>
         <ol className="list-decimal pl-5 text-[12px] space-y-1">
            <li>Build the octree by inserting each color from the image. Colors navigate down the tree based on their RGB component values relative to the center of the current node's space.</li>
            <li>Nodes store information about the colors they contain (e.g., color sum, pixel count).</li>
            <li>If the number of leaf nodes (representing distinct colors) exceeds the desired palette size, the algorithm starts merging nodes. It repeatedly finds the node at the deepest level containing the fewest pixels and merges its children up into the parent node.</li>
            <li>This merging continues until the number of leaf nodes equals the target palette size.</li>
            <li>The final palette colors are derived from the average color of the pixels represented by each remaining leaf node.</li>
          </ol>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Characteristics</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Memory efficient compared to storing all colors initially.</li>
              <li>Relatively fast, often faster than K-Means for large images.</li>
              <li>Produces good quality palettes by prioritizing the merging of less significant color regions.</li>
              <li>Widely used in graphics applications (e.g., GIF generation).</li>
          </ul>
      </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "neuquant": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Color Quantization: NeuQuant
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           <strong>NeuQuant (Neural Network Quantization)</strong> is a color quantization algorithm that uses principles inspired by self-organizing neural networks. It aims to produce high-quality palettes, especially for true-color images.
         </p>
          <p className="text-[12px] leading-tight mb-2">The core idea involves:</p>
         <ol className="list-decimal pl-5 text-[12px] space-y-1">
            <li>Initializing a "network" of neurons, each representing a potential palette color in the 3D RGB space.</li>
            <li>Iteratively presenting colors from the input image to the network.</li>
            <li>For each input color, finding the "winning" neuron (the one closest in color).</li>
            <li>Adjusting the winning neuron and its neighbors in the network to move slightly closer to the input color. The amount of adjustment decreases over time and with distance from the winning neuron.</li>
            <li>This process effectively trains the network to adapt to the distribution of colors in the image.</li>
            <li>After training, the final positions of the neurons represent the colors in the generated palette.</li>
          </ol>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Characteristics</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Often produces very high-quality palettes, preserving subtle color variations well.</li>
              <li>Can be computationally intensive, especially the training phase.</li>
              <li>Its parameters (learning rate, neighborhood size) can influence the outcome.</li>
              <li>Particularly effective for images with smooth gradients or complex color distributions.</li>
          </ul>
      </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

  "brightness-contrast": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Image Adjustments: Brightness & Contrast
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           These controls allow you to modify the tonal range of the input image *before* color quantization and dithering are applied. This can significantly impact the final dithered result.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Brightness</h2>
          <p className="text-[12px] leading-tight mb-2">
            Adjusts the overall lightness or darkness of the image.
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Increasing Brightness:</strong> Makes the image lighter. Can help reveal details in shadows but may wash out highlights.</li>
              <li><strong>Decreasing Brightness:</strong> Makes the image darker. Can add richness but may obscure shadow details.</li>
          </ul>
        </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Contrast</h2>
          <p className="text-[12px] leading-tight mb-2">
            Adjusts the difference between the light and dark areas of the image.
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Increasing Contrast:</strong> Makes darks darker and lights lighter, increasing the visual separation. Can make images look punchier but may clip details in shadows and highlights. High contrast often leads to more defined dither patterns.</li>
              <li><strong>Decreasing Contrast:</strong> Reduces the difference between light and dark areas, making the image look flatter or softer. Can bring out details in very bright or dark areas but may reduce overall impact. Low contrast can lead to muddier dither results.</li>
          </ul>
       </div>
        <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Impact on Dithering
         </h3>
         <p className="text-[11px] leading-tight">
           Adjusting brightness and contrast before dithering is crucial. For example, increasing contrast before dithering to a black and white palette will often result in a much clearer and more defined dithered image compared to dithering a low-contrast original. Experiment to see how these controls affect the final look with different dithering algorithms and palettes.
         </p>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "saturation": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Image Adjustments: Saturation
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           The Saturation control adjusts the intensity or purity of the colors in the input image before quantization and dithering.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Adjusting Saturation</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Increasing Saturation:</strong> Makes colors appear more vivid and intense. Over-saturation can lead to unnatural colors and loss of detail.</li>
              <li><strong>Decreasing Saturation:</strong> Makes colors appear duller or muted. Reducing saturation to its minimum value (0% or -100 depending on the control) will convert the image to grayscale.</li>
          </ul>
        </div>
         <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Grayscale Toggle</h2>
          <p className="text-[12px] leading-tight mb-2">
            DIETER also provides a dedicated "Grayscale" toggle. This is typically equivalent to setting Saturation to its minimum value. Applying grayscale before quantization and dithering ensures that the process works only with luminance values, which is essential for achieving classic black & white or grayscale dither effects, even if the chosen palette technically contains colors.
          </p>
        </div>
       <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Interaction with Palettes
         </h3>
         <p className="text-[11px] leading-tight">
           Adjusting saturation primarily affects the result when using color palettes or color quantization algorithms that generate color palettes. If you intend to dither to a purely grayscale or black & white palette, it's often best to use the Grayscale toggle first to ensure accurate luminance mapping. However, leaving saturation high before quantizing to a limited *color* palette (like CGA or Game Boy) can help the quantization algorithm pick more vibrant representative colors.
         </p>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "blur-sharpen": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Image Adjustments: Blur & Sharpen
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           These controls modify the perceived sharpness or softness of the input image prior to dithering.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Blur</h2>
          <p className="text-[12px] leading-tight mb-2">
            Applying blur softens the image by averaging pixel values with their neighbors.
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Effect:</strong> Reduces noise, smooths textures and gradients, decreases fine detail.</li>
              <li><strong>Impact on Dithering:</strong> Can lead to smoother, less busy dither patterns, especially with error diffusion. May reduce the distinctness of ordered dither patterns. Useful for removing unwanted texture before applying a dither texture.</li>
          </ul>
        </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Sharpen</h2>
          <p className="text-[12px] leading-tight mb-2">
            Applying sharpen enhances edges and details by increasing the contrast between adjacent pixels.
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Effect:</strong> Increases perceived detail, enhances edges and textures. Over-sharpening can create halos around edges and amplify noise.</li>
              <li><strong>Impact on Dithering:</strong> Can lead to more defined and pronounced dither patterns, emphasizing edges. May make error diffusion noise more apparent. Useful for bringing out details you want the dither pattern to follow.</li>
          </ul>
       </div>
       <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Subtle Adjustments
         </h3>
         <p className="text-[11px] leading-tight">
           Blur and sharpen effects can heavily influence the dithering outcome. Often, only subtle adjustments are needed. Excessive blurring can make the dithered image look muddy, while excessive sharpening can make it look harsh and noisy. Use these tools judiciously to prepare the image texture for the dithering process.
         </p>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "other-adjustments": (
      <div>
        <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
          Image Adjustments: Other Effects
        </h1>
        <div className="mb-4">
          <p className="text-[12px] leading-tight mb-2">
            DIETER includes additional pre-processing effects to further modify the input image before dithering.
          </p>
        </div>
         <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
           <h2 className="text-[14px] font-bold mb-2">Invert Colors</h2>
           <p className="text-[12px] leading-tight mb-2">
             This toggle reverses the colors of the image, like a photographic negative.
           </p>
           <ul className="list-disc pl-5 text-[12px] space-y-1">
               <li><strong>Effect:</strong> Light areas become dark, dark areas become light. Hues are shifted to their complementary colors (e.g., red becomes cyan, green becomes magenta, blue becomes yellow).</li>
               <li><strong>Impact on Dithering:</strong> Drastically changes the input for dithering, leading to an inverted final result. Can be used for creative effects or to correct negative scans.</li>
           </ul>
         </div>
         <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
           <h2 className="text-[14px] font-bold mb-2">Posterization</h2>
           <p className="text-[12px] leading-tight mb-2">
             Reduces the number of continuous color levels within the image *before* palette quantization. It creates broad, flat areas of color with abrupt changes between them.
           </p>
           <ul className="list-disc pl-5 text-[12px] space-y-1">
               <li><strong>Effect:</strong> Simplifies the image tonally, creating a "poster-like" look. Controlled by a slider or input defining the number of levels per channel.</li>
               <li><strong>Impact on Dithering:</strong> Creates large, flat areas that will likely be rendered with a single dither pattern or solid color after quantization/dithering. Reduces subtle gradients, making the dithering primarily define the edges between the posterized levels. Useful for achieving a stylized, graphic look.</li>
           </ul>
        </div>
        {/* Add other effects mentioned in features if applicable */}
        <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Order of Operations
         </h3>
         <p className="text-[11px] leading-tight">
           Keep in mind that these pre-processing effects are typically applied *before* the main color quantization (if used) and the dithering algorithm itself. Changing these settings modifies the input data that the subsequent steps will work on.
         </p>
       </div>
        <div className="border-t border-[#999999] pt-2 mt-4">
          <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    ),

   "batch-overview": ( // Placeholder - Batch processing not in final feature list
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Batch Processing Overview (Future Feature)
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           Batch processing allows you to apply the same set of adjustments, quantization, and dithering settings to multiple images simultaneously.
         </p>
         <p className="text-[12px] leading-tight mb-2">
           (Note: This feature might not be implemented in the current version of DIETER.)
         </p>
       </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Potential Benefits</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Saves time when processing many similar images.</li>
              <li>Ensures consistency across a set of images (e.g., for an animation or series).</li>
              <li>Useful for generating sprite sheets or texture sets with a consistent style.</li>
          </ul>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "batch-workflow": ( // Placeholder - Batch processing not in final feature list
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Batch Workflow (Future Feature)
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           The typical workflow for batch processing in DIETER would involve:
         </p>
          <p className="text-[12px] leading-tight mb-2">
           (Note: This feature might not be implemented in the current version of DIETER.)
         </p>
         <ol className="list-decimal pl-5 text-[12px] space-y-1">
            <li>Configure the desired image adjustments, quantization, palette, dithering algorithm, and parameters using a single image in the main interface.</li>
            <li>Navigate to a dedicated Batch Processing panel or mode.</li>
            <li>Upload or select multiple input images.</li>
            <li>Confirm the settings to be applied (likely inheriting the current settings).</li>
            <li>Initiate the batch process.</li>
            <li>Download the processed images, potentially as individual files or a zip archive.</li>
          </ol>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "custom-palettes": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Advanced Features: Custom Palettes
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           Beyond the predefined palettes (like B&W, Grayscale, CGA, Game Boy) and automatically generated palettes (via Median Cut, K-Means, etc.), DIETER allows you to define and use your own custom color palettes.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Defining a Custom Palette</h2>
          <p className="text-[12px] leading-tight mb-2">
            Custom palettes are typically entered as a list of color values. Common input methods include:
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Hex Codes:</strong> Entering a comma-separated or space-separated list of hexadecimal color codes (e.g., `#FF0000, #00FF00, #0000FF, #FFFFFF`).</li>
              <li><strong>Palette File Import:</strong> Uploading a palette file in a common format (like .PAL, .ACT, or a simple text file with one hex code per line). (Support for specific formats may vary).</li>
              <li><strong>Color Picker Interface:</strong> An interface allowing you to visually pick colors and add them to the current custom palette.</li>
          </ul>
           <p className="text-[12px] leading-tight mt-2">
             Refer to the DIETER interface for the specific method(s) supported for custom palette input.
           </p>
        </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Using a Custom Palette</h2>
          <ol className="list-decimal pl-5 text-[12px] space-y-1">
             <li>Define or import your custom palette using the available controls.</li>
             <li>Select "Custom" or the name of your loaded palette from the main Palette selection dropdown in the Dithering Controls panel.</li>
             <li>The dithering algorithm will now use only the colors present in your custom palette for the output image.</li>
           </ol>
       </div>
        <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Creative Control
         </h3>
         <p className="text-[11px] leading-tight">
           Custom palettes offer immense creative control. You can force an image into a specific artistic color scheme, match a corporate brand guide, or experiment with highly limited palettes for extreme stylization. The quality of the result heavily depends on how well the chosen palette relates to the original image's colors.
         </p>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "histogram": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Advanced Features: Histogram Analysis
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           DIETER includes a Histogram panel that visually represents the tonal distribution of the image. It shows how many pixels exist at each brightness level.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Understanding the Histogram</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>X-axis:</strong> Represents the brightness levels, typically from 0 (black) on the left to 255 (white) on the right.</li>
              <li><strong>Y-axis:</strong> Represents the number of pixels at that specific brightness level. Higher peaks indicate more pixels at that level.</li>
              <li><strong>Channels:</strong> The histogram might display combined luminance (overall brightness) or allow viewing individual Red, Green, and Blue channels.</li>
              <li><strong>Source Image:</strong> The histogram usually reflects the state of the image *after* pre-processing adjustments (like brightness/contrast) but *before* quantization and dithering. Check the interface for specifics.</li>
          </ul>
        </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">How to Use It</h2>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li><strong>Assessing Exposure:</strong> A histogram bunched to the left indicates a dark (underexposed) image. Bunched to the right indicates a bright (overexposed) image. A good spread suggests a well-exposed image with detail across the tonal range.</li>
              <li><strong>Identifying Clipping:</strong> Tall spikes at the extreme left (0) or extreme right (255) indicate clipped shadows or highlights, respectively, meaning detail is lost in those areas.</li>
              <li><strong>Guiding Adjustments:</strong> Use the histogram to see the effect of Brightness and Contrast adjustments. For example, increasing contrast should spread the histogram out towards the edges, while decreasing contrast should bunch it towards the middle.</li>
              <li><strong>Predicting Dithering Results:</strong> An image with distinct peaks in the histogram might quantize more cleanly than one with a very flat, spread-out histogram, although the specific quantization algorithm also plays a major role.</li>
          </ul>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "processing-log": (
     <div>
       <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
         Advanced Features: Processing Log
       </h1>
       <div className="mb-4">
         <p className="text-[12px] leading-tight mb-2">
           The Processing Log panel provides a textual record of the operations performed on the image and potentially performance information or warnings.
         </p>
       </div>
        <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Information Displayed</h2>
          <p className="text-[12px] leading-tight mb-2">
            The log might include entries for:
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
              <li>Image Uploaded (filename, dimensions)</li>
              <li>Pre-processing Effects Applied (e.g., "Applied Brightness: +10", "Applied Contrast: -5", "Converted to Grayscale")</li>
              <li>Color Quantization Started/Completed (Algorithm used, Target color count, Time taken)</li>
              <li>Dithering Algorithm Applied (Algorithm name, Parameters like strength/pattern size, Time taken)</li>
              <li>Palette Selection (Predefined or Custom)</li>
              <li>Warnings (e.g., "Large image processing may take time", "High diffusion strength may cause artifacts")</li>
              <li>Errors (e.g., "Failed to load image", "Invalid custom palette format")</li>
          </ul>
        </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
          <h2 className="text-[14px] font-bold mb-2">Log Controls</h2>
           <p className="text-[12px] leading-tight mb-2">
            The panel may offer controls such as:
          </p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
             <li><strong>Clear Log:</strong> Erases the current log entries.</li>
             <li><strong>Copy Log:</strong> Copies the log content to the clipboard for pasting elsewhere (e.g., for debugging or reporting issues).</li>
             <li><strong>Log Level:</strong> Allows filtering messages (e.g., show only Errors, Warnings, Info, or All).</li>
           </ul>
       </div>
       <div className="border-t border-[#999999] pt-2 mt-4">
         <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
       </div>
     </div>
   ),

   "troubleshooting": (
    <div>
      <h1 className="text-[18px] font-bold mb-3 pb-1 border-b-2 border-[#3366cc]">
        Troubleshooting
      </h1>
      <div className="mb-4">
        <p className="text-[12px] leading-tight mb-2">
          If you encounter issues while using DIETER, consider these common problems and solutions.
        </p>
      </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
         <h2 className="text-[14px] font-bold mb-2">Image Upload Issues</h2>
         <ul className="list-disc pl-5 text-[12px] space-y-1">
             <li><strong>File not uploading:</strong> Ensure the file format is supported (JPG, PNG, GIF, WEBP) and within the size limits (see <a href="#uploading-images" className="text-[#3366cc] underline">Uploading Images</a>). Try a different image or format. Check browser console (F12) for errors.</li>
            <li><strong>Image appears distorted after upload:</strong> This is unlikely unless the source file is corrupted. Try re-saving the source image.</li>
         </ul>
       </div>
      <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
         <h2 className="text-[14px] font-bold mb-2">Slow Performance / Freezing</h2>
         <ul className="list-disc pl-5 text-[12px] space-y-1">
             <li><strong>Large Images:</strong> Processing very large images (high resolution) takes significant time and memory, especially with complex algorithms (K-Means, NeuQuant, Jarvis). Try resizing the image beforehand or use simpler algorithms.</li>
             <li><strong>Complex Settings:</strong> High color counts for quantization combined with slow dithering algorithms can be demanding.</li>
             <li><strong>Browser Issues:</strong> Ensure your browser is up-to-date. Try clearing browser cache/cookies. Disable demanding browser extensions temporarily. Check system resource usage (Task Manager/Activity Monitor).</li>
             <li><strong>Web Workers:</strong> If the application uses Web Workers for processing, ensure they aren't being blocked by browser settings or extensions.</li>
         </ul>
       </div>
       <div className="border border-[#999999] p-2 bg-[#e8e8e8] mb-4">
         <h2 className="text-[14px] font-bold mb-2">Unexpected Visual Results</h2>
         <ul className="list-disc pl-5 text-[12px] space-y-1">
             <li><strong>Muddy/Undefined Dithering:</strong> Often caused by low contrast in the input image or inappropriate palette choice. Try increasing contrast before dithering. Ensure the palette has enough range for the image content.</li>
             <li><strong>Harsh Patterns / Noise:</strong> May result from excessive sharpening or high contrast. Try reducing these or applying a slight blur before dithering. High diffusion strength can also enhance noise.</li>
             <li><strong>Incorrect Colors:</strong> Ensure the correct palette is selected. If using quantization, try a different algorithm. Check if grayscale or invert toggles are active. If using custom palettes, verify the color codes are correct.</li>
             <li><strong>Visible Repeating Patterns (Ordered Dithering):</strong> This is characteristic of ordered dithering. Use a larger pattern size (e.g., 8x8 Bayer) or switch to error diffusion or random dithering if the pattern is undesirable.</li>
             <li><strong>"Worm" Artifacts (Error Diffusion):</strong> Characteristic of some error diffusion algorithms. Try a different one (e.g., Atkinson might show fewer), adjust diffusion strength, or use ordered dithering.</li>
         </ul>
       </div>
        <div className="border border-[#999999] p-2 bg-[#ffffcc] mb-4">
         <h3 className="text-[12px] font-bold mb-1 flex items-center">
           <span className="inline-block w-4 h-4 bg-[#ffcc33] text-black text-center mr-1 border border-[#cc9900]">
             !
           </span>
           Check the Log
         </h3>
         <p className="text-[11px] leading-tight">
           Always check the <a href="#processing-log" className="text-[#3366cc] underline">Processing Log</a> panel for specific warnings or error messages that might indicate the cause of the problem.
         </p>
       </div>
      <div className="border-t border-[#999999] pt-2 mt-4">
        <div className="text-[10px] text-[#666666]">Last updated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  ),

};
