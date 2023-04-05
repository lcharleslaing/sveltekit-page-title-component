const fs = require("fs");
const path = require("path");

async function updateAllPages(dirPath) {
    const srcDir = path.join(dirPath, "src", "routes");

    const updatePageFile = (filePath) => {
        fs.readFile(filePath, "utf-8", (err, fileContent) => {
            if (err) {
                console.error(`Error reading file: ${err.message}`);
                return;
            }

            const updatedFileContent = updateFileContent(fileContent);

            fs.writeFile(filePath, updatedFileContent, (err) => {
                if (err) {
                    console.error(`Error writing file: ${err.message}`);
                    return;
                }

                console.log(`Updated file: ${filePath}`);
            });
        });
    };

    const searchDirectory = (currentPath) => {
        const files = fs.readdirSync(currentPath);

        for (const file of files) {
            const fullPath = path.join(currentPath, file);

            if (fs.lstatSync(fullPath).isDirectory()) {
                searchDirectory(fullPath);
            } else if (file === "+page.svelte") {
                updatePageFile(fullPath);
            }
        }
    };

    searchDirectory(srcDir);
}

async function updateFileContent(fileContent) {
    const pageTitle = `
<!-- to set a custom title, use the commented version below -->
<!-- <PageTitle customTitle="Your Custom Title" /> -->
<PageTitle />
  `;
    const pageTitleScript = `\nimport PageTitle from "$lib/components/PageTitle.svelte";\n`;

    const lines = fileContent.split("\n");
    let updatedContent = "";

    let pageTitleAdded = false;
    let scriptUpdated = false;
    let scriptTagFound = false;

    for (const line of lines) {
        if (line.startsWith("<script")) {
            scriptTagFound = true;
        }

        // Check if the import and component are already in the file
        if (
            line.includes('import PageTitle from "$lib/components/PageTitle.svelte"') ||
            line.includes("<PageTitle")
        ) {
            return fileContent;
        }

        if (!scriptUpdated && scriptTagFound && line.startsWith("<script")) {
            updatedContent += line + pageTitleScript;
            scriptUpdated = true;
            continue;
        }

        updatedContent += line + "\n";

        if (!pageTitleAdded && scriptUpdated && line.includes("</script>")) {
            updatedContent += pageTitle;
            pageTitleAdded = true;
        }
    }

    // If no <script> tag was found, create one and add the import and component code
    if (!scriptTagFound) {
        updatedContent = `<script>${pageTitleScript}</script>\n${updatedContent}${pageTitle}`;
    }

    return updatedContent;
}
async function createPageTitleComponent(dirPath) {
    // Create the src/lib/components directory if it doesn't exist
    const componentsDir = path.join(dirPath, "src", "lib", "components");
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }

    // Create the PageTitle.svelte file in the src/lib/components directory
    const pageTitleComponentPath = path.join(componentsDir, "PageTitle.svelte");
    const pageTitleComponentContent = `
<!-- src/lib/components/PageTitle.svelte -->
<script>
import { onMount } from "svelte";

let title = "";
let isHomePage = false;
export let customTitle;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

onMount(() => {
    const pathname = window.location.pathname;
    isHomePage = pathname === "/";
    const routeName = isHomePage
        ? "Big2Tiny Solutions"
        : pathname.split("/").pop() || "home";
    title =
        routeName === "Big2Tiny Solutions"
            ? routeName
            : capitalizeFirstLetter(routeName);
    if (customTitle) {
        title = customTitle;
    }
    document.title = title;
});
</script>

<div class="text-center">
  {#if !isHomePage}
      <h2 class="text-2xl font-extrabold uppercase mt-4">{title}</h2>
  {/if}
</div>

  `;

    fs.writeFile(
        pageTitleComponentPath,
        pageTitleComponentContent,
        { flag: "wx" },
        (err) => {
            if (err && err.code !== "EEXIST") {
                console.error(`Error creating file: ${err.message}`);
                return;
            }
            console.log(`Created file: ${pageTitleComponentPath}`);
        }
    );
}

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
createPageTitleComponent(targetDir);
updateAllPages(targetDir);