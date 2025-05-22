exports.version = 1.2;
exports.apiRequired = 8.87;
exports.description = "Auto-show media by clicking icons, and click the file name to open the file menu.";
exports.repo = "Hug3O/Instant-show";
exports.frontend_js = 'main.js';

exports.config = {
  image: { type: 'boolean', defaultValue: true, label: "Auto-open images", frontend: true },
  video: { type: 'boolean', defaultValue: true, label: "Auto-open videos", frontend: true },
  audio: { type: 'boolean', defaultValue: false, label: "Auto-open audio files", frontend: true },
  other: { type: 'boolean', defaultValue: false, label: "Auto-open other file types", frontend: true },
  otherExtensions: {
    type: 'string',
    defaultValue: 'htm|html',
    label: "Other file extensions",
    helperText: "Separate extensions with | (e.g., html|htm|pdf)",
    frontend: true
  }
};
