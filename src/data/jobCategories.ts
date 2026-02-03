
export type FieldDefinition = {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  required?: boolean;
};

export type JobCategoryDefinition = {
  id: string;
  label: string;
  printingFields: FieldDefinition[];
  fabricationFields: FieldDefinition[];
};

export const JOB_CATEGORIES: JobCategoryDefinition[] = [
  {
    id: "wall_calendar",
    label: "Wall Calendar",
    printingFields: [
      { name: "colour", label: "Colour", type: "select", options: ["CMYK", "B/W", "Pantone"] },
      { name: "pages", label: "Pages", type: "number", required: true },
      { name: "paper", label: "Paper", type: "select", options: ["170gsm Art", "300gsm Art", "Maplitho"] },
      { name: "side", label: "Side", type: "select", options: ["Single", "Double"] },
      { name: "size", label: "Size", type: "select", options: ["A3", "A2", "Custom"] },
    ],
    fabricationFields: [
       { name: "binding", label: "Binding", type: "select", options: ["Wiro", "Staple", "Perfect Binding"] },
       { name: "lamination", label: "Lamination", type: "select", options: ["Gloss", "Matt", "Velvet", "None"] },
    ]
  },
  {
    id: "wristband",
    label: "Wristband Printing",
    printingFields: [
      { name: "colour", label: "Colour", type: "select", options: ["CMYK", "B/W"] },
      { name: "paper", label: "Paper", type: "select", options: ["Tyvek", "Vinyl", "Fabric"] },
    ],
    fabricationFields: [
        { name: "gumming", label: "Gumming", type: "select", options: ["Yes", "No"] },
        { name: "cutting", label: "Cutting", type: "select", options: ["Die Cut", "Straight"] },
    ]
  },
  {
      id: "visiting_card",
      label: "Visiting Card",
      printingFields: [
          { name: "paper", label: "Paper", type: "select", options: ["300gsm Art", "Textured", "Metallic"] },
          { name: "side", label: "Side", type: "select", options: ["Single", "Double"] }
      ],
      fabricationFields: [
          { name: "lamination", label: "Lamination", type: "select", options: ["Matt", "Gloss", "Velvet"] },
          { name: "cutting", label: "Cutting", type: "select", options: ["Round Corner", "Square"] }
      ]
  },
  {
      id: "sticker",
      label: "Sticker / Label",
      printingFields: [
           { name: "material", label: "Material", type: "select", options: ["Paper", "Vinyl", "Transparent"] },
           { name: "print_type", label: "Print Type", type: "select", options: ["Digital", "Offset"] }
      ],
      fabricationFields: [
          { name: "cutting", label: "Cutting", type: "select", options: ["Kiss Cut", "Die Cut", "Sheet"] }
      ]
  }
];
