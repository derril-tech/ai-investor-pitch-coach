# Created automatically by Cursor AI (2024-08-24)
from celery import shared_task
from typing import Dict, Any, List
import logging
import pandas as pd
import numpy as np
from datetime import datetime

logger = logging.getLogger(__name__)


@shared_task(bind=True, name="finance_linter.analyze_financials")
def analyze_financials(self, startup_id: str, financial_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze financial data and identify key metrics and potential issues
    
    Args:
        startup_id: ID of the startup
        financial_data: Financial data including metrics, projections, etc.
    
    Returns:
        Dict containing analysis results, metrics, and recommendations
    """
    try:
        logger.info(f"Starting financial analysis for startup {startup_id}")
        
        # Extract key metrics
        metrics = extract_metrics(financial_data)
        
        # Analyze metrics against benchmarks
        analysis = analyze_metrics(metrics)
        
        # Identify anomalies and red flags
        anomalies = identify_anomalies(metrics, analysis)
        
        # Generate recommendations
        recommendations = generate_recommendations(metrics, analysis, anomalies)
        
        result = {
            "startup_id": startup_id,
            "metrics": metrics,
            "analysis": analysis,
            "anomalies": anomalies,
            "recommendations": recommendations,
            "status": "completed",
            "message": "Financial analysis completed successfully",
            "created_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Completed financial analysis for startup {startup_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing financials for startup {startup_id}: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise


def extract_metrics(financial_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract key financial metrics from data"""
    
    # TODO: Implement actual data extraction logic
    # For now, return mock metrics
    
    return {
        "cac": financial_data.get("cac", 150),  # Customer Acquisition Cost
        "ltv": financial_data.get("ltv", 1200),  # Lifetime Value
        "ltv_cac_ratio": financial_data.get("ltv_cac_ratio", 8.0),
        "churn_rate": financial_data.get("churn_rate", 0.05),  # 5% monthly churn
        "gross_margin": financial_data.get("gross_margin", 0.75),  # 75%
        "burn_rate": financial_data.get("burn_rate", 500000),  # Monthly burn
        "runway": financial_data.get("runway", 18),  # Months
        "arr": financial_data.get("arr", 2000000),  # Annual Recurring Revenue
        "mrr": financial_data.get("mrr", 166667),  # Monthly Recurring Revenue
        "payback_period": financial_data.get("payback_period", 8),  # Months
        "net_revenue_retention": financial_data.get("net_revenue_retention", 1.15),  # 115%
        "gross_revenue_retention": financial_data.get("gross_revenue_retention", 0.95),  # 95%
    }


def analyze_metrics(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze metrics against industry benchmarks"""
    
    # Industry benchmarks (these would come from a database in production)
    benchmarks = {
        "saas": {
            "cac": {"good": 100, "warning": 200, "critical": 300},
            "ltv_cac_ratio": {"good": 3.0, "warning": 2.0, "critical": 1.0},
            "churn_rate": {"good": 0.05, "warning": 0.10, "critical": 0.15},
            "gross_margin": {"good": 0.80, "warning": 0.70, "critical": 0.60},
            "payback_period": {"good": 12, "warning": 18, "critical": 24},
            "net_revenue_retention": {"good": 1.20, "warning": 1.10, "critical": 1.00},
        },
        "marketplace": {
            "cac": {"good": 50, "warning": 100, "critical": 150},
            "ltv_cac_ratio": {"good": 4.0, "warning": 3.0, "critical": 2.0},
            "churn_rate": {"good": 0.10, "warning": 0.15, "critical": 0.20},
            "gross_margin": {"good": 0.60, "warning": 0.50, "critical": 0.40},
        }
    }
    
    # Use SaaS benchmarks for now
    saas_benchmarks = benchmarks["saas"]
    
    analysis = {}
    
    for metric, value in metrics.items():
        if metric in saas_benchmarks:
            benchmark = saas_benchmarks[metric]
            
            # Determine status based on benchmarks
            if value >= benchmark["good"]:
                status = "good"
            elif value >= benchmark["warning"]:
                status = "warning"
            else:
                status = "critical"
            
            analysis[metric] = {
                "value": value,
                "benchmark": benchmark,
                "status": status,
                "score": calculate_score(value, benchmark)
            }
    
    return analysis


def calculate_score(value: float, benchmark: Dict[str, float]) -> float:
    """Calculate a score from 0-100 based on benchmark performance"""
    
    if value >= benchmark["good"]:
        return 100.0
    elif value >= benchmark["warning"]:
        # Linear interpolation between warning and good
        range_size = benchmark["good"] - benchmark["warning"]
        position = (value - benchmark["warning"]) / range_size
        return 60 + (position * 40)  # 60-100 range
    else:
        # Linear interpolation between critical and warning
        range_size = benchmark["warning"] - benchmark["critical"]
        if range_size == 0:
            return 0.0
        position = (value - benchmark["critical"]) / range_size
        return max(0, position * 60)  # 0-60 range


def identify_anomalies(metrics: Dict[str, Any], analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Identify financial anomalies and red flags"""
    
    anomalies = []
    
    # Check for critical issues
    for metric, analysis_data in analysis.items():
        if analysis_data["status"] == "critical":
            anomalies.append({
                "type": f"critical_{metric}",
                "severity": "critical",
                "metric": metric,
                "value": analysis_data["value"],
                "benchmark": analysis_data["benchmark"]["critical"],
                "message": f"{metric.upper()} is critically low at {analysis_data['value']}",
                "impact": "High risk to business sustainability"
            })
        elif analysis_data["status"] == "warning":
            anomalies.append({
                "type": f"warning_{metric}",
                "severity": "warning",
                "metric": metric,
                "value": analysis_data["value"],
                "benchmark": analysis_data["benchmark"]["warning"],
                "message": f"{metric.upper()} is below optimal at {analysis_data['value']}",
                "impact": "Moderate risk to growth and efficiency"
            })
    
    # Check for specific red flags
    if metrics.get("ltv_cac_ratio", 0) < 1.0:
        anomalies.append({
            "type": "ltv_cac_negative",
            "severity": "critical",
            "metric": "ltv_cac_ratio",
            "value": metrics["ltv_cac_ratio"],
            "message": "LTV/CAC ratio is less than 1, indicating unsustainable unit economics",
            "impact": "Business model may not be viable"
        })
    
    if metrics.get("churn_rate", 0) > 0.20:
        anomalies.append({
            "type": "high_churn",
            "severity": "critical",
            "metric": "churn_rate",
            "value": metrics["churn_rate"],
            "message": f"Monthly churn rate of {metrics['churn_rate']:.1%} is extremely high",
            "impact": "Customer retention issues need immediate attention"
        })
    
    if metrics.get("runway", 0) < 6:
        anomalies.append({
            "type": "short_runway",
            "severity": "critical",
            "metric": "runway",
            "value": metrics["runway"],
            "message": f"Runway of {metrics['runway']} months is dangerously short",
            "impact": "Immediate fundraising or cost reduction needed"
        })
    
    if metrics.get("gross_margin", 0) < 0.50:
        anomalies.append({
            "type": "low_margin",
            "severity": "warning",
            "metric": "gross_margin",
            "value": metrics["gross_margin"],
            "message": f"Gross margin of {metrics['gross_margin']:.1%} is below industry standard",
            "impact": "May indicate pricing or cost structure issues"
        })
    
    return anomalies


def generate_recommendations(metrics: Dict[str, Any], analysis: Dict[str, Any], anomalies: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate actionable recommendations based on analysis"""
    
    recommendations = []
    
    # High priority recommendations for critical issues
    critical_anomalies = [a for a in anomalies if a["severity"] == "critical"]
    
    for anomaly in critical_anomalies:
        if anomaly["type"] == "ltv_cac_negative":
            recommendations.append({
                "priority": "high",
                "category": "unit_economics",
                "title": "Fix Unit Economics",
                "description": "LTV/CAC ratio is unsustainable. Focus on increasing customer lifetime value or reducing acquisition costs.",
                "actions": [
                    "Optimize pricing strategy to increase LTV",
                    "Improve customer retention programs",
                    "Optimize marketing channels to reduce CAC",
                    "Consider product-led growth strategies"
                ],
                "expected_impact": "Critical for business sustainability"
            })
        
        elif anomaly["type"] == "high_churn":
            recommendations.append({
                "priority": "high",
                "category": "retention",
                "title": "Reduce Customer Churn",
                "description": "High churn rate indicates product-market fit or customer success issues.",
                "actions": [
                    "Implement customer success programs",
                    "Improve onboarding experience",
                    "Add customer feedback loops",
                    "Consider product improvements based on usage data"
                ],
                "expected_impact": "Immediate impact on revenue and growth"
            })
        
        elif anomaly["type"] == "short_runway":
            recommendations.append({
                "priority": "high",
                "category": "funding",
                "title": "Extend Runway",
                "description": "Dangerously short runway requires immediate action.",
                "actions": [
                    "Begin fundraising process immediately",
                    "Implement cost reduction measures",
                    "Focus on revenue-generating activities",
                    "Consider bridge financing options"
                ],
                "expected_impact": "Critical for business survival"
            })
    
    # Medium priority recommendations for warnings
    warning_anomalies = [a for a in anomalies if a["severity"] == "warning"]
    
    for anomaly in warning_anomalies:
        if anomaly["type"] == "low_margin":
            recommendations.append({
                "priority": "medium",
                "category": "pricing",
                "title": "Improve Gross Margins",
                "description": "Gross margins below industry standard may indicate pricing or cost issues.",
                "actions": [
                    "Review pricing strategy and consider increases",
                    "Optimize cost of goods sold",
                    "Negotiate better vendor terms",
                    "Consider premium tier offerings"
                ],
                "expected_impact": "Improve profitability and investor appeal"
            })
    
    # General recommendations based on metrics
    if metrics.get("payback_period", 0) > 12:
        recommendations.append({
            "priority": "medium",
            "category": "efficiency",
            "title": "Optimize Customer Acquisition",
            "description": "Long payback period indicates inefficient customer acquisition.",
            "actions": [
                "Optimize marketing channels and campaigns",
                "Improve conversion rates",
                "Consider referral programs",
                "Focus on higher-value customer segments"
            ],
            "expected_impact": "Improve cash flow and efficiency"
        })
    
    if metrics.get("net_revenue_retention", 0) < 1.10:
        recommendations.append({
            "priority": "medium",
            "category": "growth",
            "title": "Improve Revenue Retention",
            "description": "Net revenue retention below 110% indicates expansion opportunities.",
            "actions": [
                "Implement upselling and cross-selling programs",
                "Improve customer success and account management",
                "Add premium features and tiers",
                "Focus on enterprise customers"
            ],
            "expected_impact": "Increase revenue per customer"
        })
    
    return recommendations


@shared_task(bind=True, name="finance_linter.validate_projections")
def validate_projections(self, startup_id: str, projections: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate financial projections for realism and consistency
    
    Args:
        startup_id: ID of the startup
        projections: Financial projections data
    
    Returns:
        Dict containing validation results and feedback
    """
    try:
        logger.info(f"Validating projections for startup {startup_id}")
        
        # Validate growth assumptions
        growth_validation = validate_growth_assumptions(projections)
        
        # Check for consistency
        consistency_check = check_projection_consistency(projections)
        
        # Identify unrealistic assumptions
        unrealistic_assumptions = identify_unrealistic_assumptions(projections)
        
        result = {
            "startup_id": startup_id,
            "growth_validation": growth_validation,
            "consistency_check": consistency_check,
            "unrealistic_assumptions": unrealistic_assumptions,
            "overall_score": calculate_projection_score(growth_validation, consistency_check, unrealistic_assumptions),
            "status": "completed",
            "message": "Projection validation completed",
            "created_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Completed projection validation for startup {startup_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error validating projections for startup {startup_id}: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise


def validate_growth_assumptions(projections: Dict[str, Any]) -> Dict[str, Any]:
    """Validate growth rate assumptions for realism"""
    
    # TODO: Implement actual validation logic
    # For now, return mock validation
    
    return {
        "revenue_growth": {
            "assumed_rate": projections.get("revenue_growth_rate", 0.20),
            "is_realistic": True,
            "confidence": 0.85,
            "notes": "Growth rate is within reasonable bounds for the stage"
        },
        "customer_growth": {
            "assumed_rate": projections.get("customer_growth_rate", 0.15),
            "is_realistic": True,
            "confidence": 0.80,
            "notes": "Customer growth aligns with revenue projections"
        }
    }


def check_projection_consistency(projections: Dict[str, Any]) -> Dict[str, Any]:
    """Check for consistency across different projection components"""
    
    # TODO: Implement actual consistency checks
    # For now, return mock results
    
    return {
        "revenue_customer_alignment": True,
        "cost_structure_consistency": True,
        "cash_flow_balance": True,
        "issues": []
    }


def identify_unrealistic_assumptions(projections: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Identify potentially unrealistic assumptions in projections"""
    
    # TODO: Implement actual assumption checking
    # For now, return empty list
    
    return []


def calculate_projection_score(growth_validation: Dict[str, Any], consistency_check: Dict[str, Any], unrealistic_assumptions: List[Dict[str, Any]]) -> float:
    """Calculate overall projection credibility score"""
    
    # TODO: Implement actual scoring logic
    # For now, return mock score
    
    return 85.0
