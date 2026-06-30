import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI on server-side
// User-Agent: aistudio-build is set in httpOptions for telemetry as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API: Check status of server
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Perform detailed cross-framework control mapping
app.post("/api/gemini/map", async (req, res) => {
  try {
    const { sourceFramework, sourceControl, targetFramework, targetControl } = req.body;

    if (!sourceFramework || !sourceControl || !targetFramework) {
      return res.status(400).json({ error: "Missing required mapping details." });
    }

    const prompt = `
      Perform a deep cybersecurity audit mapping and gap analysis between:
      Source Framework: ${sourceFramework}
      Source Control: ${sourceControl.id} - ${sourceControl.name}: "${sourceControl.description}"
      
      Target Framework: ${targetFramework.fullName} (${targetFramework.name})
      ${targetControl ? `Specific Target Control: ${targetControl.id} - ${targetControl.name}: "${targetControl.description}"` : "Please map to the best-matching control in the target framework."}

      Provide a high-quality audit mapping with a thorough compliance analysis. Include alignment rationale, key gaps, alignment confidence rating (High/Medium/Low), testing methodology, and suggested evidence artifacts.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a lead IT auditor, GRC director, and security standards expert. You specialize in mapping financial and security standards (NIST CSF, ISO 27001, COBIT, CIS, SWIFT CSP, PCI DSS, BNM RMiT, MAS TRM) to find gaps and consolidate audit testing procedures.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetControlId: { type: Type.STRING, description: "ID of the best-matching control in the target framework." },
            targetControlName: { type: Type.STRING, description: "Name of the best-matching control in the target framework." },
            targetControlDescription: { type: Type.STRING, description: "Brief description of the target control." },
            alignmentRationale: { type: Type.STRING, description: "Detailed description of how the two controls align, overlap, or fulfill similar operational objectives." },
            gapAnalysis: { type: Type.STRING, description: "Explicit differences, exceptions, or additional criteria that must be satisfied in the target framework compared to the source framework." },
            confidenceLevel: { type: Type.STRING, description: "Alignment confidence level. Must be 'High', 'Medium', or 'Low' depending on overlap degree." },
            testingMethodology: { type: Type.STRING, description: "A detailed, consolidated testing script or audit procedure that covers both controls to save effort during a joint audit." },
            suggestedArtifacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific documentation, policy references, screenshots, system logs, or logs to request as evidence."
            }
          },
          required: [
            "targetControlId",
            "targetControlName",
            "targetControlDescription",
            "alignmentRationale",
            "gapAnalysis",
            "confidenceLevel",
            "testingMethodology",
            "suggestedArtifacts"
          ]
        }
      }
    });

    const mappingResult = JSON.parse(response.text || "{}");
    res.json(mappingResult);

  } catch (error: any) {
    console.error("Gemini mapping error:", error);
    res.status(500).json({ error: error.message || "Failed to generate control mapping." });
  }
});

// API: Generate highly customized, standard-aligned audit program
app.post("/api/gemini/generate-program", async (req, res) => {
  try {
    const { name, organization, sector, selectedFrameworks, customFocus } = req.body;

    if (!selectedFrameworks || selectedFrameworks.length === 0) {
      return res.status(400).json({ error: "Please select at least one framework." });
    }

    const prompt = `
      Develop a comprehensive and directly aligned Cybersecurity Audit Work Program for the following organization profile:
      Project Name: ${name || "General Cybersecurity Audit"}
      Organization: ${organization || "Confidential Financial/Enterprise"}
      Sector: ${sector || "Financial & Technology Services"}
      Aligned Standards: ${selectedFrameworks.join(", ")}
      Custom Audit Scope Focus: ${customFocus || "Focus on core cybersecurity controls, user access, and logging configuration."}

      The generated audit program must provide a series of rigorous, actionable test steps that are directly mapped to the regulatory requirements of the selected frameworks. Be specific, realistic, and highly practical. Avoid generalities.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a distinguished GRC Cyber Auditor. Create a professional, detailed audit testing program. Ensure testing procedures contain specific tasks, and the evidence requested lists actual technical logs or documentation. Design exactly 6 high-impact audit testing steps spanning across the core domains (such as Governance, Identity, Protection, Detection, and Incident Readiness).`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Formal title of the audit program." },
            scope: { type: Type.STRING, description: "Specific definition of the audit scope based on organization parameters." },
            alignedFrameworks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The list of frameworks this audit program is mapping against."
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  objective: { type: Type.STRING, description: "Clear objective of this testing step (e.g. Verify MFA enforcement on all administrative access)." },
                  procedure: { type: Type.STRING, description: "Step-by-step audit testing procedure. What policies to read, who to interview, what samples to request, what logs to review." },
                  evidenceRequested: { type: Type.STRING, description: "Specific logs, screenshots, configurations, or documents to gather from the client." },
                  sampleGuideline: { type: Type.STRING, description: "Auditing sample guidance (e.g., 'Inspect a random sample of 25 staff accounts', or 'Select 3 firewall change tickets from the past 60 days')." },
                  interviewQuestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "High-impact interview questions to ask the system engineers or security officers during testing."
                  }
                },
                required: ["stepNumber", "objective", "procedure", "evidenceRequested", "sampleGuideline", "interviewQuestions"]
              }
            },
            additionalRecommendations: { type: Type.STRING, description: "Strategic GRC and compliance advisory remarks for the executive board." }
          },
          required: ["title", "scope", "alignedFrameworks", "steps", "additionalRecommendations"]
        }
      }
    });

    const programResult = JSON.parse(response.text || "{}");
    res.json(programResult);

  } catch (error: any) {
    console.error("Gemini program generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate custom audit program." });
  }
});

// API: Generate Remediation Plan for finding
app.post("/api/gemini/remediate", async (req, res) => {
  try {
    const { controlId, controlName, frameworkName, findingDetails } = req.body;

    if (!controlId || !findingDetails) {
      return res.status(400).json({ error: "Missing control or finding details." });
    }

    const prompt = `
      Control failing: ${controlId} - ${controlName} (Framework: ${frameworkName})
      Audit Finding Detail: "${findingDetails}"

      Generate a concrete, realistic, and highly practical remediation action plan to fix this finding.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a cyber security remediation officer. Provide a realistic project plan to fix specific audit findings, with technical solutions, estimated timelines, and success indicators.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            immediateActions: { type: Type.STRING, description: "Short-term immediate fixes or mitigating controls to implement within 48-72 hours." },
            longTermRemediation: { type: Type.STRING, description: "Strategic permanent solutions to configure, purchase, or write policies for to prevent recurrence." },
            estimatedTimeline: { type: Type.STRING, description: "Realistic timeline needed to implement (e.g., '2-4 Weeks', '3 Months')." },
            remediationOwner: { type: Type.STRING, description: "Typical role responsible (e.g. Systems Engineer, IAM Specialist, ISO)." },
            testingProof: { type: Type.STRING, description: "What artifacts the auditor will ask for during the follow-up review to prove it's fully remediated." }
          },
          required: ["immediateActions", "longTermRemediation", "estimatedTimeline", "remediationOwner", "testingProof"]
        }
      }
    });

    const remediationPlan = JSON.parse(response.text || "{}");
    res.json(remediationPlan);

  } catch (error: any) {
    console.error("Gemini remediation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate remediation guide." });
  }
});

// Configure Vite or Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
