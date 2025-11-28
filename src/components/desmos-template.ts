/**
 * Shared HTML template for Desmos calculator widget
 * Used by both remark-desmos plugin and DesmosBlock component
 */

export interface DesmosTemplateConfig {
    uniqueId: string;
    width: string;
    height: string;
}

/**
 * Generate HTML structure for Desmos calculator widget
 */
export function generateDesmosHTML(config: DesmosTemplateConfig): string {
    const { uniqueId, width, height } = config;

    return `
<div id="${uniqueId}-container" class="desmos-container" style="width: ${width}; height: ${height}; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; cursor: pointer; transition: all 0.2s ease;">
    <!-- Graph Paper Background -->
    <div style="position: absolute; inset: 0; background-color: #f8f9fa; background-image: linear-gradient(#e9ecef 1px, transparent 1px), linear-gradient(90deg, #e9ecef 1px, transparent 1px); background-size: 20px 20px; z-index: 0;"></div>
    
    <!-- Placeholder Content -->
    <div id="${uniqueId}-placeholder" style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #495057; font-family: system-ui, sans-serif; transition: opacity 0.2s;">
        <div id="${uniqueId}-placeholder-title" style="font-size: 1.2em; font-weight: 700; margin-bottom: 8px;"></div>
        <div id="${uniqueId}-placeholder-subtitle" style="font-size: 0.9em; opacity: 0.7;"></div>
    </div>

    <!-- Loading Overlay -->
    <div id="${uniqueId}-loading" style="display: none; position: absolute; inset: 0; z-index: 2; background: rgba(248, 249, 250, 0.9); align-items: center; justify-content: center; flex-direction: column; opacity: 0;">
        <div style="width: 24px; height: 24px; border: 3px solid #dee2e6; border-top-color: #495057; border-radius: 50%; animation: desmos-spin 1s linear infinite; margin-bottom: 12px;"></div>
        <div id="${uniqueId}-loading-text" style="font-size: 0.9em; color: #495057; font-weight: 500;"></div>
    </div>

    <!-- Calculator Container -->
    <div id="${uniqueId}" style="position: relative; z-index: 3; width: 100%; height: 100%; display: none; opacity: 0;"></div>
</div>
<style>
@keyframes desmos-spin {
    to { transform: rotate(360deg); }
}
</style>`;
}
