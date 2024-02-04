declare global {
  interface Window {
    lunr: any; // Use 'any' as a fallback type if you're unsure about the structure
  }
}