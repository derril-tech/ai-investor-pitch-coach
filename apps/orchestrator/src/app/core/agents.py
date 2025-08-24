# Created automatically by Cursor AI (2024-08-24)
from crewai import Agent, Task, Crew
from typing import Dict, Any, List
import logging
from .prompts import *

logger = logging.getLogger(__name__)


class AgentFactory:
    """Factory for creating CrewAI agents"""
    
    @staticmethod
    def create_story_coach() -> Agent:
        """Create the Story Coach agent for narrative development"""
        return Agent(
            role="Story Coach",
            goal="Transform startup ideas into compelling, fundable pitch narratives",
            backstory=STORY_COACH_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add specific tools for narrative analysis
        )
    
    @staticmethod
    def create_finance_analyst() -> Agent:
        """Create the Finance Analyst agent for financial validation"""
        return Agent(
            role="Finance Analyst",
            goal="Analyze financial models and identify key metrics and potential issues",
            backstory=FINANCE_ANALYST_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add financial analysis tools
        )
    
    @staticmethod
    def create_market_analyst() -> Agent:
        """Create the Market Analyst agent for market sizing and analysis"""
        return Agent(
            role="Market Analyst",
            goal="Conduct thorough market analysis and calculate TAM/SAM/SOM",
            backstory=MARKET_ANALYST_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add market research tools
        )
    
    @staticmethod
    def create_vc_partner() -> Agent:
        """Create the VC Partner agent for red-team questions"""
        return Agent(
            role="VC Partner",
            goal="Generate challenging questions and provide critical feedback from an investor perspective",
            backstory=VC_PARTNER_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add question generation tools
        )
    
    @staticmethod
    def create_product_expert() -> Agent:
        """Create the Product Expert agent for product strategy"""
        return Agent(
            role="Product Expert",
            goal="Analyze product strategy and provide insights on product-market fit",
            backstory=PRODUCT_EXPERT_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add product analysis tools
        )
    
    @staticmethod
    def create_compliance_expert() -> Agent:
        """Create the Compliance Expert agent for regulatory and legal review"""
        return Agent(
            role="Compliance Expert",
            goal="Review pitch materials for regulatory compliance and legal accuracy",
            backstory=COMPLIANCE_EXPERT_SYSTEM_PROMPT,
            verbose=True,
            allow_delegation=False,
            tools=[]  # TODO: Add compliance checking tools
        )


class TaskFactory:
    """Factory for creating CrewAI tasks"""
    
    @staticmethod
    def create_narrative_draft_task(startup_data: Dict[str, Any]) -> Task:
        """Create task for drafting initial narrative"""
        prompt = STORY_COACH_NARRATIVE_PROMPT.format(
            startup_name=startup_data.get('name', 'Unknown Startup'),
            sector=startup_data.get('sector', 'Unknown Sector'),
            stage=startup_data.get('stage', 'Unknown Stage'),
            description=startup_data.get('description', 'No description provided'),
            additional_context=startup_data.get('additional_context', 'No additional context'),
            tone=startup_data.get('tone', 'professional'),
            focus_areas=startup_data.get('focus_areas', 'general'),
            length=startup_data.get('length', 'medium')
        )
        
        return Task(
            description=prompt,
            agent=AgentFactory.create_story_coach(),
            expected_output="Complete pitch narrative with all sections in JSON format"
        )
    
    @staticmethod
    def create_narrative_rewrite_task(startup_data: Dict[str, Any], section: str, current_content: str, requirements: str) -> Task:
        """Create task for rewriting a specific narrative section"""
        prompt = STORY_COACH_SECTION_REWRITE_PROMPT.format(
            section=section,
            startup_name=startup_data.get('name', 'Unknown Startup'),
            current_content=current_content,
            sector=startup_data.get('sector', 'Unknown Sector'),
            stage=startup_data.get('stage', 'Unknown Stage'),
            description=startup_data.get('description', 'No description provided'),
            requirements=requirements,
            tone=startup_data.get('tone', 'professional'),
            length=startup_data.get('length', 'medium')
        )
        
        return Task(
            description=prompt,
            agent=AgentFactory.create_story_coach(),
            expected_output=f"Rewritten {section} section in JSON format"
        )
    
    @staticmethod
    def create_financial_analysis_task(startup_data: Dict[str, Any], financial_data: Dict[str, Any]) -> Task:
        """Create task for financial analysis"""
        prompt = FINANCE_ANALYST_DIAGNOSTICS_PROMPT.format(
            startup_name=startup_data.get('name', 'Unknown Startup'),
            financial_data=str(financial_data)
        )
        
        return Task(
            description=prompt,
            agent=AgentFactory.create_finance_analyst(),
            expected_output="Financial analysis report with metrics and recommendations in JSON format"
        )
    
    @staticmethod
    def create_market_sizing_task(startup_data: Dict[str, Any], market_data: Dict[str, Any]) -> Task:
        """Create task for market sizing analysis"""
        prompt = MARKET_ANALYST_SIZING_PROMPT.format(
            startup_name=startup_data.get('name', 'Unknown Startup'),
            sector=startup_data.get('sector', 'Unknown Sector'),
            target_market=market_data.get('target_market', 'General'),
            geography=market_data.get('geography', 'Global'),
            market_data=str(market_data),
            methodology=market_data.get('methodology', 'top_down')
        )
        
        return Task(
            description=prompt,
            agent=AgentFactory.create_market_analyst(),
            expected_output="Market sizing analysis with TAM/SAM/SOM calculations in JSON format"
        )
    
    @staticmethod
    def create_question_generation_task(startup_data: Dict[str, Any], narrative: str, difficulty: str = 'medium', count: int = 10) -> Task:
        """Create task for generating investor questions"""
        prompt = VC_PARTNER_QUESTIONS_PROMPT.format(
            startup_name=startup_data.get('name', 'Unknown Startup'),
            sector=startup_data.get('sector', 'Unknown Sector'),
            stage=startup_data.get('stage', 'Unknown Stage'),
            narrative=narrative,
            difficulty=difficulty,
            count=count
        )
        
        return Task(
            description=prompt,
            agent=AgentFactory.create_vc_partner(),
            expected_output="List of investor questions with categories and difficulty levels in JSON format"
        )


class CrewManager:
    """Manages CrewAI crews for different workflows"""
    
    def __init__(self):
        self.crews: Dict[str, Crew] = {}
    
    def create_narrative_crew(self, startup_data: Dict[str, Any]) -> Crew:
        """Create a crew for narrative development"""
        agents = [
            AgentFactory.create_story_coach(),
            AgentFactory.create_product_expert(),
            AgentFactory.create_compliance_expert(),
        ]
        
        tasks = [
            TaskFactory.create_narrative_draft_task(startup_data),
        ]
        
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            memory=True
        )
        
        return crew
    
    def create_narrative_rewrite_crew(self, startup_data: Dict[str, Any], section: str, current_content: str, requirements: str) -> Crew:
        """Create a crew for rewriting narrative sections"""
        agents = [
            AgentFactory.create_story_coach(),
            AgentFactory.create_compliance_expert(),
        ]
        
        tasks = [
            TaskFactory.create_narrative_rewrite_task(startup_data, section, current_content, requirements),
        ]
        
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            memory=True
        )
        
        return crew
    
    def create_analysis_crew(self, startup_data: Dict[str, Any]) -> Crew:
        """Create a crew for comprehensive analysis"""
        agents = [
            AgentFactory.create_finance_analyst(),
            AgentFactory.create_market_analyst(),
            AgentFactory.create_vc_partner(),
        ]
        
        tasks = [
            TaskFactory.create_financial_analysis_task(startup_data, startup_data.get('financials', {})),
            TaskFactory.create_market_sizing_task(startup_data, startup_data.get('market', {})),
        ]
        
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            memory=True
        )
        
        return crew
    
    def create_qa_crew(self, startup_data: Dict[str, Any], narrative: str, difficulty: str = 'medium', count: int = 10) -> Crew:
        """Create a crew for Q&A generation"""
        agents = [
            AgentFactory.create_vc_partner(),
            AgentFactory.create_finance_analyst(),
        ]
        
        tasks = [
            TaskFactory.create_question_generation_task(startup_data, narrative, difficulty, count),
        ]
        
        crew = Crew(
            agents=agents,
            tasks=tasks,
            verbose=True,
            memory=True
        )
        
        return crew
