/**
 * When true, skip real Agora/Firebase in flows that need backend keys.
 * Set NEXT_PUBLIC_DESIGN_MOCKUP=true in .env.local for pure UI / design work.
 */
export const isDesignMockup = process.env.NEXT_PUBLIC_DESIGN_MOCKUP === "true";
