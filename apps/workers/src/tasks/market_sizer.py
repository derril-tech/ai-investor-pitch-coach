# Created automatically by Cursor AI (2024-08-24)
from celery import shared_task
from typing import Dict, Any, List
import logging
import pandas as pd
import numpy as np
from datetime import datetime

logger = logging.getLogger(__name__)


@shared_task(bind=True, name="market_sizer.calculate_market_size")
def calculate_market_size(self, startup_id: str, market_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate TAM, SAM, and SOM for a startup
    
    Args:
        startup_id: ID of the startup
        market_data: Market data including methodology, inputs, etc.
    
    Returns:
        Dict containing TAM/SAM/SOM calculations and analysis
    """
    try:
        logger.info(f"Starting market sizing for startup {startup_id}")
        
        methodology = market_data.get("methodology", "top_down")
        inputs = market_data.get("inputs", {})
        
        # Calculate market sizes based on methodology
        if methodology == "top_down":
            results = calculate_top_down(inputs)
        elif methodology == "bottom_up":
            results = calculate_bottom_up(inputs)
        elif methodology == "analogy":
            results = calculate_analogy(inputs)
        else:
            results = calculate_hybrid(inputs)
        
        # Perform sensitivity analysis
        sensitivity = perform_sensitivity_analysis(results, inputs)
        
        # Validate assumptions
        validation = validate_market_assumptions(inputs, results)
        
        result = {
            "startup_id": startup_id,
            "methodology": methodology,
            "inputs": inputs,
            "results": results,
            "sensitivity": sensitivity,
            "validation": validation,
            "status": "completed",
            "message": "Market sizing completed successfully",
            "created_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Completed market sizing for startup {startup_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error calculating market size for startup {startup_id}: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise


def calculate_top_down(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate market size using top-down methodology"""
    
    # Extract inputs
    total_market_size = inputs.get("total_market_size", 100000000000)  # $100B default
    target_segment_percentage = inputs.get("target_segment_percentage", 0.20)  # 20%
    geographic_percentage = inputs.get("geographic_percentage", 0.15)  # 15%
    accessibility_factor = inputs.get("accessibility_factor", 0.10)  # 10%
    
    # Calculate TAM (Total Addressable Market)
    tam = total_market_size * target_segment_percentage * geographic_percentage
    
    # Calculate SAM (Serviceable Addressable Market)
    sam = tam * accessibility_factor
    
    # Calculate SOM (Serviceable Obtainable Market)
    # Assume 5% market share in 5 years
    som = sam * 0.05
    
    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "assumptions": {
            "total_market_size": total_market_size,
            "target_segment_percentage": target_segment_percentage,
            "geographic_percentage": geographic_percentage,
            "accessibility_factor": accessibility_factor,
            "market_share_assumption": 0.05
        }
    }


def calculate_bottom_up(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate market size using bottom-up methodology"""
    
    # Extract inputs
    target_customers = inputs.get("target_customers", 1000000)  # 1M customers
    avg_revenue_per_customer = inputs.get("avg_revenue_per_customer", 500)  # $500/year
    market_penetration = inputs.get("market_penetration", 0.05)  # 5%
    
    # Calculate TAM
    tam = target_customers * avg_revenue_per_customer
    
    # Calculate SAM (assume 20% of TAM is serviceable)
    sam = tam * 0.20
    
    # Calculate SOM
    som = sam * market_penetration
    
    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "assumptions": {
            "target_customers": target_customers,
            "avg_revenue_per_customer": avg_revenue_per_customer,
            "market_penetration": market_penetration,
            "serviceable_percentage": 0.20
        }
    }


def calculate_analogy(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate market size using analogy methodology"""
    
    # Extract inputs
    comparable_market_size = inputs.get("comparable_market_size", 50000000000)  # $50B
    market_multiplier = inputs.get("market_multiplier", 0.8)  # 80% of comparable
    target_percentage = inputs.get("target_percentage", 0.10)  # 10%
    
    # Calculate TAM based on comparable market
    tam = comparable_market_size * market_multiplier
    
    # Calculate SAM
    sam = tam * target_percentage
    
    # Calculate SOM (assume 3% market share)
    som = sam * 0.03
    
    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "assumptions": {
            "comparable_market_size": comparable_market_size,
            "market_multiplier": market_multiplier,
            "target_percentage": target_percentage,
            "market_share_assumption": 0.03
        }
    }


def calculate_hybrid(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate market size using hybrid methodology"""
    
    # Combine top-down and bottom-up approaches
    top_down_results = calculate_top_down(inputs)
    bottom_up_results = calculate_bottom_up(inputs)
    
    # Average the results
    tam = (top_down_results["tam"] + bottom_up_results["tam"]) / 2
    sam = (top_down_results["sam"] + bottom_up_results["sam"]) / 2
    som = (top_down_results["som"] + bottom_up_results["som"]) / 2
    
    return {
        "tam": tam,
        "sam": sam,
        "som": som,
        "assumptions": {
            "methodology": "hybrid",
            "top_down_weight": 0.5,
            "bottom_up_weight": 0.5
        }
    }


def perform_sensitivity_analysis(results: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Perform sensitivity analysis on market size calculations"""
    
    methodology = inputs.get("methodology", "top_down")
    
    if methodology == "top_down":
        return sensitivity_analysis_top_down(results, inputs)
    elif methodology == "bottom_up":
        return sensitivity_analysis_bottom_up(results, inputs)
    else:
        return sensitivity_analysis_generic(results, inputs)


def sensitivity_analysis_top_down(results: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Sensitivity analysis for top-down methodology"""
    
    base_tam = results["tam"]
    base_sam = results["sam"]
    base_som = results["som"]
    
    # Vary key assumptions by ±20%
    variations = {
        "total_market_size": [0.8, 1.0, 1.2],
        "target_segment_percentage": [0.8, 1.0, 1.2],
        "geographic_percentage": [0.8, 1.0, 1.2],
        "accessibility_factor": [0.8, 1.0, 1.2]
    }
    
    sensitivity_results = {}
    
    for assumption, multipliers in variations.items():
        tam_range = []
        sam_range = []
        som_range = []
        
        for multiplier in multipliers:
            # Recalculate with modified assumption
            modified_inputs = inputs.copy()
            if assumption in modified_inputs:
                modified_inputs[assumption] = modified_inputs[assumption] * multiplier
            
            modified_results = calculate_top_down(modified_inputs)
            tam_range.append(modified_results["tam"])
            sam_range.append(modified_results["sam"])
            som_range.append(modified_results["som"])
        
        sensitivity_results[assumption] = {
            "tam_range": [min(tam_range), max(tam_range)],
            "sam_range": [min(sam_range), max(sam_range)],
            "som_range": [min(som_range), max(som_range)]
        }
    
    return {
        "base_case": {
            "tam": base_tam,
            "sam": base_sam,
            "som": base_som
        },
        "sensitivity_results": sensitivity_results,
        "key_drivers": identify_key_drivers(sensitivity_results)
    }


def sensitivity_analysis_bottom_up(results: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Sensitivity analysis for bottom-up methodology"""
    
    base_tam = results["tam"]
    base_sam = results["sam"]
    base_som = results["som"]
    
    # Vary key assumptions by ±20%
    variations = {
        "target_customers": [0.8, 1.0, 1.2],
        "avg_revenue_per_customer": [0.8, 1.0, 1.2],
        "market_penetration": [0.8, 1.0, 1.2]
    }
    
    sensitivity_results = {}
    
    for assumption, multipliers in variations.items():
        tam_range = []
        sam_range = []
        som_range = []
        
        for multiplier in multipliers:
            # Recalculate with modified assumption
            modified_inputs = inputs.copy()
            if assumption in modified_inputs:
                modified_inputs[assumption] = modified_inputs[assumption] * multiplier
            
            modified_results = calculate_bottom_up(modified_inputs)
            tam_range.append(modified_results["tam"])
            sam_range.append(modified_results["sam"])
            som_range.append(modified_results["som"])
        
        sensitivity_results[assumption] = {
            "tam_range": [min(tam_range), max(tam_range)],
            "sam_range": [min(sam_range), max(sam_range)],
            "som_range": [min(som_range), max(som_range)]
        }
    
    return {
        "base_case": {
            "tam": base_tam,
            "sam": base_sam,
            "som": base_som
        },
        "sensitivity_results": sensitivity_results,
        "key_drivers": identify_key_drivers(sensitivity_results)
    }


def sensitivity_analysis_generic(results: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Generic sensitivity analysis for other methodologies"""
    
    return {
        "base_case": {
            "tam": results["tam"],
            "sam": results["sam"],
            "som": results["som"]
        },
        "sensitivity_results": {},
        "key_drivers": []
    }


def identify_key_drivers(sensitivity_results: Dict[str, Any]) -> List[str]:
    """Identify the key drivers of market size based on sensitivity analysis"""
    
    # Calculate the range of variation for each assumption
    variations = {}
    
    for assumption, ranges in sensitivity_results.items():
        tam_variation = (ranges["tam_range"][1] - ranges["tam_range"][0]) / ranges["tam_range"][0]
        variations[assumption] = tam_variation
    
    # Sort by variation and return top 3
    sorted_variations = sorted(variations.items(), key=lambda x: x[1], reverse=True)
    return [assumption for assumption, _ in sorted_variations[:3]]


def validate_market_assumptions(inputs: Dict[str, Any], results: Dict[str, Any]) -> Dict[str, Any]:
    """Validate market sizing assumptions for realism"""
    
    validation_results = {}
    
    # Validate TAM size
    tam = results["tam"]
    if tam > 1000000000000:  # $1T
        validation_results["tam_size"] = {
            "status": "warning",
            "message": "TAM size is very large (>$1T). Verify market definition and assumptions.",
            "recommendation": "Consider narrowing market definition or validating with industry experts."
        }
    elif tam < 1000000000:  # $1B
        validation_results["tam_size"] = {
            "status": "warning",
            "message": "TAM size is relatively small (<$1B). May limit investor interest.",
            "recommendation": "Consider expanding market definition or targeting adjacent markets."
        }
    else:
        validation_results["tam_size"] = {
            "status": "good",
            "message": "TAM size is reasonable for most investors.",
            "recommendation": "Proceed with current market definition."
        }
    
    # Validate SAM/TAM ratio
    sam_tam_ratio = results["sam"] / results["tam"]
    if sam_tam_ratio > 0.5:
        validation_results["sam_tam_ratio"] = {
            "status": "warning",
            "message": "SAM represents more than 50% of TAM. May indicate overly broad market definition.",
            "recommendation": "Consider narrowing market definition to focus on core opportunity."
        }
    elif sam_tam_ratio < 0.05:
        validation_results["sam_tam_ratio"] = {
            "status": "warning",
            "message": "SAM represents less than 5% of TAM. May indicate overly narrow market definition.",
            "recommendation": "Consider expanding market definition to capture more opportunity."
        }
    else:
        validation_results["sam_tam_ratio"] = {
            "status": "good",
            "message": "SAM/TAM ratio is reasonable.",
            "recommendation": "Market definition appears appropriate."
        }
    
    # Validate SOM/SAM ratio
    som_sam_ratio = results["som"] / results["sam"]
    if som_sam_ratio > 0.1:
        validation_results["som_sam_ratio"] = {
            "status": "warning",
            "message": "SOM represents more than 10% of SAM. May be overly optimistic.",
            "recommendation": "Review market share assumptions and competitive landscape."
        }
    elif som_sam_ratio < 0.01:
        validation_results["som_sam_ratio"] = {
            "status": "warning",
            "message": "SOM represents less than 1% of SAM. May be overly conservative.",
            "recommendation": "Review market share assumptions and competitive advantages."
        }
    else:
        validation_results["som_sam_ratio"] = {
            "status": "good",
            "message": "SOM/SAM ratio is reasonable.",
            "recommendation": "Market share assumptions appear realistic."
        }
    
    return validation_results


@shared_task(bind=True, name="market_sizer.update_market_data")
def update_market_data(self, startup_id: str, new_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update market data and recalculate market sizes
    
    Args:
        startup_id: ID of the startup
        new_data: Updated market data
    
    Returns:
        Dict containing updated calculations
    """
    try:
        logger.info(f"Updating market data for startup {startup_id}")
        
        # Recalculate market sizes with new data
        results = calculate_market_size(startup_id, new_data)
        
        # TODO: Save updated results to database
        
        logger.info(f"Completed market data update for startup {startup_id}")
        return results
        
    except Exception as e:
        logger.error(f"Error updating market data for startup {startup_id}: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise
