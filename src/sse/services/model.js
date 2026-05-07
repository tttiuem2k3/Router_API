// Re-export from open-sse with localDb integration
import { getModelAliases, getComboByName, getProviderNodes, getProviderConnections } from "@/lib/localDb";
import { parseModel, resolveModelAliasFromMap, getModelInfoCore } from "open-sse/services/model.js";
import { getProviderModels } from "open-sse/config/providerModels.js";

export { parseModel };

/**
 * Resolve model alias from localDb
 */
export async function resolveModelAlias(alias) {
  const aliases = await getModelAliases();
  return resolveModelAliasFromMap(alias, aliases);
}

/**
 * Get full model info (parse or resolve)
 */
export async function getModelInfo(modelStr) {
  const parsed = parseModel(modelStr);

  const hasActiveConnections = async (providerId) => {
    const connections = await getProviderConnections({ provider: providerId, isActive: true });
    return connections.length > 0;
  };

  const shouldFallbackToCodex = async (modelId) => {
    const hasOpenAI = await hasActiveConnections("openai");
    if (hasOpenAI) return false;
    const hasCodex = await hasActiveConnections("codex");
    if (!hasCodex) return false;
    const codexModels = getProviderModels("cx");
    return codexModels.some((m) => m.id === modelId);
  };

  if (!parsed.isAlias) {
    // Always check provider-node prefix matching using original input first
    const openaiNodes = await getProviderNodes({ type: "openai-compatible" });
    const matchedOpenAI = openaiNodes.find((node) => node.prefix === parsed.providerAlias);
    if (matchedOpenAI) {
      return { provider: matchedOpenAI.id, model: parsed.model };
    }

    const anthropicNodes = await getProviderNodes({ type: "anthropic-compatible" });
    const matchedAnthropic = anthropicNodes.find((node) => node.prefix === parsed.providerAlias);
    if (matchedAnthropic) {
      return { provider: matchedAnthropic.id, model: parsed.model };
    }

    const embeddingNodes = await getProviderNodes({ type: "custom-embedding" });
    const matchedEmbedding = embeddingNodes.find((node) => node.prefix === parsed.providerAlias);
    if (matchedEmbedding) {
      return { provider: matchedEmbedding.id, model: parsed.model };
    }
    if (parsed.provider === "openai" && await shouldFallbackToCodex(parsed.model)) {
      return { provider: "codex", model: parsed.model };
    }
    return { provider: parsed.provider, model: parsed.model };
  }

  // Check if this is a combo name before resolving as alias
  // This prevents combo names from being incorrectly routed to providers
  const combo = await getComboByName(parsed.model);
  if (combo) {
    // Return null provider to signal this should be handled as combo
    // The caller (handleChat) will detect this and handle it as combo
    return { provider: null, model: parsed.model };
  }

  const resolved = await getModelInfoCore(modelStr, getModelAliases);
  if (resolved.provider === "openai" && await shouldFallbackToCodex(resolved.model)) {
    return { provider: "codex", model: resolved.model };
  }
  return resolved;
}

/**
 * Check if model is a combo and get models list
 * @returns {Promise<string[]|null>} Array of models or null if not a combo
 */
export async function getComboModels(modelStr) {
  // Only check if it's not in provider/model format
  if (modelStr.includes("/")) return null;

  const combo = await getComboByName(modelStr);
  if (combo && combo.models && combo.models.length > 0) {
    return combo.models;
  }
  return null;
}
