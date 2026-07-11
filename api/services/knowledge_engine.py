"""
Rule-based knowledge engine for generating shift briefings from pulse data.
Replaces the previous Gemini-based briefing generator.
No external AI services are used.
"""
import json
from typing import List, Dict, Optional


def generate_shift_briefing(pulse_data: List[Dict]) -> str:
    """
    Generates a shift briefing for volunteers based on recent pulse data.
    Uses rule-based analysis instead of AI.
    """
    if not pulse_data:
        return "No recent fan queries available to generate a briefing."

    # Aggregate by zone and intent
    zone_counts: Dict[str, int] = {}
    intent_counts: Dict[str, int] = {}
    zone_intents: Dict[str, Dict[str, int]] = {}

    for log in pulse_data:
        zone = log.get("zone") or "Unknown"
        intent = log.get("intent", "general")

        zone_counts[zone] = zone_counts.get(zone, 0) + 1
        intent_counts[intent] = intent_counts.get(intent, 0) + 1

        if zone not in zone_intents:
            zone_intents[zone] = {}
        zone_intents[zone][intent] = zone_intents[zone].get(intent, 0) + 1

    # Sort zones by query count (descending)
    sorted_zones = sorted(zone_counts.items(), key=lambda x: x[1], reverse=True)
    sorted_intents = sorted(intent_counts.items(), key=lambda x: x[1], reverse=True)

    total_queries = sum(zone_counts.values())

    # Build briefing
    lines = []
    lines.append(f"SHIFT BRIEFING — {total_queries} total queries in the current window.")
    lines.append("")

    # High volume zones
    high_volume_zones = [(z, c) for z, c in sorted_zones if c >= 10]
    if high_volume_zones:
        lines.append("⚠️ HIGH VOLUME ZONES:")
        for zone, count in high_volume_zones:
            top_intent = max(zone_intents.get(zone, {}), key=zone_intents[zone].get, default="general")
            lines.append(f"  • {zone}: {count} queries (mostly {top_intent}) — consider deploying additional staff.")
        lines.append("")

    # Top intents
    if sorted_intents:
        lines.append("📊 TOP QUERY CATEGORIES:")
        for intent, count in sorted_intents[:3]:
            pct = round((count / total_queries) * 100) if total_queries > 0 else 0
            lines.append(f"  • {intent.capitalize()}: {count} queries ({pct}%)")
        lines.append("")

    # Recommendations
    lines.append("📋 RECOMMENDATIONS:")
    if any(intent_counts.get(i, 0) > 5 for i in ["navigation"]):
        lines.append("  • Navigation queries are elevated. Check wayfinding signage and deploy additional guides.")
    if any(intent_counts.get(i, 0) > 3 for i in ["safety", "emergency"]):
        lines.append("  • Safety/emergency queries detected. Ensure medical stations are fully staffed.")
    if any(intent_counts.get(i, 0) > 3 for i in ["amenity"]):
        lines.append("  • High amenity demand. Check restroom supplies and food court queue management.")
    if any(intent_counts.get(i, 0) > 3 for i in ["transit"]):
        lines.append("  • Transit queries elevated. Ensure shuttle schedules are posted and visible.")
    if not any(intent_counts.get(i, 0) > 3 for i in ["navigation", "safety", "amenity", "transit"]):
        lines.append("  • All query volumes are within normal ranges. Maintain standard staffing levels.")

    return "\n".join(lines)
