# Created automatically by Cursor AI (2024-08-24)
from celery import shared_task
from typing import Dict, Any, List
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


@shared_task(bind=True, name="slide_builder.build_slides")
def build_slides(self, narrative_id: str, brand_config: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Build slides from narrative outline
    
    Args:
        narrative_id: ID of the narrative to build slides from
        brand_config: Brand configuration (colors, fonts, etc.)
    
    Returns:
        Dict containing slide data and metadata
    """
    try:
        logger.info(f"Starting slide build for narrative {narrative_id}")
        
        # TODO: Fetch narrative from database
        # For now, use mock narrative data
        narrative = get_mock_narrative(narrative_id)
        
        # Generate slides based on narrative sections
        slides = generate_slides_from_narrative(narrative, brand_config)
        
        # TODO: Save slides to database
        # TODO: Generate PPTX file using python-pptx
        
        result = {
            "narrative_id": narrative_id,
            "slides": slides,
            "brand_config": brand_config,
            "status": "completed",
            "message": "Slides built successfully",
            "created_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Completed slide build for narrative {narrative_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error building slides for narrative {narrative_id}: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise


def get_mock_narrative(narrative_id: str) -> Dict[str, Any]:
    """Get mock narrative data for development"""
    return {
        "id": narrative_id,
        "startup_name": "Example Startup",
        "sector": "SaaS",
        "stage": "seed",
        "outline": {
            "problem": "Small businesses struggle to manage their customer relationships effectively, leading to lost opportunities and poor customer retention.",
            "solution": "Our AI-powered CRM platform automates customer interactions, provides actionable insights, and helps businesses build stronger relationships.",
            "market": "The global CRM market is valued at $58.5B and growing at 12% annually. We target the SMB segment, which represents $15B in opportunity.",
            "traction": "We have 500+ paying customers, $2M ARR, 15% month-over-month growth, and 95% customer satisfaction score.",
            "team": "Our team includes former executives from Salesforce and HubSpot, with deep expertise in CRM and AI technologies.",
            "funding": "We're raising $5M Series A to expand our team, enhance our AI capabilities, and scale our go-to-market efforts."
        }
    }


def generate_slides_from_narrative(narrative: Dict[str, Any], brand_config: Dict[str, Any] = None) -> List[Dict[str, Any]]:
    """Generate slides from narrative outline"""
    
    # Default brand config
    if not brand_config:
        brand_config = {
            "colors": ["#2563eb", "#1e40af", "#1e293b"],
            "fonts": ["Inter", "Arial", "sans-serif"],
            "logo": None
        }
    
    slides = []
    
    # Title slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "title",
        "title": narrative["startup_name"],
        "subtitle": f"{narrative['sector']} • {narrative['stage'].title()} Stage",
        "layout": "title",
        "content": {
            "background_color": brand_config["colors"][0],
            "text_color": "#ffffff",
            "logo": brand_config.get("logo")
        }
    })
    
    # Problem slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "problem",
        "title": "The Problem",
        "subtitle": "What we're solving",
        "layout": "content",
        "content": {
            "main_text": narrative["outline"]["problem"],
            "bullets": [
                "Complex customer relationship management",
                "Lost opportunities due to poor tracking",
                "Low customer retention rates",
                "Inefficient communication processes"
            ],
            "visual": "problem_illustration"
        }
    })
    
    # Solution slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "solution",
        "title": "Our Solution",
        "subtitle": "How we solve it",
        "layout": "content",
        "content": {
            "main_text": narrative["outline"]["solution"],
            "bullets": [
                "AI-powered automation",
                "Intelligent insights and analytics",
                "Seamless integration capabilities",
                "User-friendly interface"
            ],
            "visual": "solution_diagram"
        }
    })
    
    # Market slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "market",
        "title": "Market Opportunity",
        "subtitle": "The size of the prize",
        "layout": "market",
        "content": {
            "main_text": narrative["outline"]["market"],
            "market_data": {
                "tam": "$58.5B",
                "sam": "$15B",
                "som": "$500M"
            },
            "visual": "market_chart"
        }
    })
    
    # Traction slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "traction",
        "title": "Traction & Metrics",
        "subtitle": "Proof of progress",
        "layout": "metrics",
        "content": {
            "main_text": narrative["outline"]["traction"],
            "metrics": [
                {"label": "Customers", "value": "500+", "trend": "up"},
                {"label": "ARR", "value": "$2M", "trend": "up"},
                {"label": "Growth", "value": "15% MoM", "trend": "up"},
                {"label": "Satisfaction", "value": "95%", "trend": "stable"}
            ],
            "visual": "metrics_chart"
        }
    })
    
    # Team slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "team",
        "title": "Team",
        "subtitle": "Why we can execute",
        "layout": "team",
        "content": {
            "main_text": narrative["outline"]["team"],
            "team_members": [
                {"name": "CEO", "background": "Former Salesforce VP"},
                {"name": "CTO", "background": "Ex-HubSpot Engineering Lead"},
                {"name": "CPO", "background": "AI/ML Expert"}
            ],
            "visual": "team_photos"
        }
    })
    
    # Funding slide
    slides.append({
        "id": f"slide_{len(slides) + 1}",
        "type": "funding",
        "title": "Funding Ask",
        "subtitle": "Investment opportunity",
        "layout": "funding",
        "content": {
            "main_text": narrative["outline"]["funding"],
            "funding_details": {
                "amount": "$5M",
                "round": "Series A",
                "use_of_funds": [
                    "Team expansion (40%)",
                    "Product development (30%)",
                    "Sales & marketing (20%)",
                    "Operations (10%)"
                ]
            },
            "visual": "funding_chart"
        }
    })
    
    return slides


@shared_task(bind=True, name="slide_builder.generate_pptx")
def generate_pptx(self, slides_data: List[Dict[str, Any]], output_path: str) -> Dict[str, Any]:
    """
    Generate PowerPoint file from slide data
    
    Args:
        slides_data: List of slide data
        output_path: Path to save the PPTX file
    
    Returns:
        Dict containing file metadata
    """
    try:
        logger.info(f"Generating PPTX file with {len(slides_data)} slides")
        
        # TODO: Implement actual PPTX generation using python-pptx
        # For now, return mock result
        
        result = {
            "file_path": output_path,
            "slide_count": len(slides_data),
            "file_size": "2.5MB",
            "status": "completed",
            "message": "PPTX file generated successfully",
            "created_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"Completed PPTX generation: {output_path}")
        return result
        
    except Exception as e:
        logger.error(f"Error generating PPTX file: {str(e)}")
        self.retry(countdown=60, max_retries=3)
        raise


@shared_task(bind=True, name="slide_builder.apply_branding")
def apply_branding(self, slides_data: List[Dict[str, Any]], brand_config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Apply branding to slides
    
    Args:
        slides_data: List of slide data
        brand_config: Brand configuration
    
    Returns:
        List of branded slide data
    """
    try:
        logger.info("Applying branding to slides")
        
        branded_slides = []
        for slide in slides_data:
            # Apply brand colors and fonts
            branded_slide = slide.copy()
            branded_slide["branding"] = {
                "primary_color": brand_config.get("colors", ["#2563eb"])[0],
                "secondary_color": brand_config.get("colors", ["#1e40af"])[1] if len(brand_config.get("colors", [])) > 1 else "#1e40af",
                "font_family": brand_config.get("fonts", ["Inter"])[0],
                "logo": brand_config.get("logo")
            }
            branded_slides.append(branded_slide)
        
        logger.info(f"Applied branding to {len(branded_slides)} slides")
        return branded_slides
        
    except Exception as e:
        logger.error(f"Error applying branding: {str(e)}")
        self.retry(countdown=30, max_retries=2)
        raise
