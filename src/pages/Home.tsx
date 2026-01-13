import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { callAIAgent, NormalizedAgentResponse } from '@/utils/aiAgent'
import {
  Search, Github, Code, Users, GitBranch, MessageSquare,
  Clock, Star, TrendingUp, Lightbulb, Target, Loader2,
  ArrowLeft, ExternalLink, Calendar, Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Agent ID from orchestrator
const AGENT_ID = "6966b2f01f8ceefab631347f"

// TypeScript interfaces matching ACTUAL response schema from test results
interface TechnicalSkills {
  primary_languages: string[]
  frameworks_tools: string[]
  domain_expertise: string[]
  proficiency_level: string
}

interface ProblemSolving {
  approach: string
  strengths: string[]
  code_quality_indicators: string[]
}

interface CollaborationStyle {
  communication_quality: string
  team_interaction: string
  review_participation: string
}

interface WorkingPatterns {
  commit_frequency: string
  consistency: string
  focus_areas: string[]
}

interface Recommendations {
  ideal_projects: string[]
  team_fit: string
  growth_opportunities: string[]
}

interface ProfileResult {
  developer_summary: string
  technical_skills: TechnicalSkills
  problem_solving: ProblemSolving
  collaboration_style: CollaborationStyle
  working_patterns: WorkingPatterns
  unique_insights: string[]
  recommendations: Recommendations
}

interface ProfileMetadata {
  agent_name: string
  timestamp: string
  repositories_analyzed: number
  data_points_collected: number
}

interface ProfileResponse extends NormalizedAgentResponse {
  result: ProfileResult & Record<string, any>
  metadata?: ProfileMetadata
}

// Sample profiles for showcase
const sampleProfiles = [
  { username: 'torvalds', name: 'Linus Torvalds', skill: 'Kernel Development' },
  { username: 'gvanrossum', name: 'Guido van Rossum', skill: 'Python Core' },
  { username: 'tj', name: 'TJ Holowaychuk', skill: 'Full Stack' },
]

// Loading states for progress indicator
const loadingSteps = [
  'Fetching GitHub profile...',
  'Analyzing repositories...',
  'Processing contributions...',
  'Evaluating code patterns...',
  'Building developer profile...',
]

// Profile Header Component
function ProfileHeader({ profile }: { profile: ProfileResult }) {
  return (
    <div className="flex items-start gap-6 mb-8">
      <div className="w-24 h-24 bg-[#FFD700] border-[5px] border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Github className="w-12 h-12 text-black" />
      </div>
      <div className="flex-1">
        <h1 className="text-4xl font-black text-black mb-3">Developer Profile</h1>
        <p className="text-black text-lg leading-relaxed font-bold">
          {profile.developer_summary || 'Analyzing developer profile...'}
        </p>
      </div>
    </div>
  )
}

// Quick Stats Sidebar Component
function QuickStatsSidebar({ profile, metadata }: { profile: ProfileResult; metadata?: ProfileMetadata }) {
  return (
    <Card className="bg-white border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-[4px] border-black bg-[#00FFFF] pb-4">
        <CardTitle className="text-black font-black flex items-center gap-2 text-xl">
          <Activity className="w-6 h-6 text-black" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="bg-[#FFEB3B] border-[4px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm text-black font-bold mb-2">Repositories Analyzed</div>
          <div className="text-4xl font-black text-black">
            {metadata?.repositories_analyzed || 0}
          </div>
        </div>

        <Separator className="bg-black h-[3px]" />

        <div>
          <div className="text-sm text-black font-bold mb-3">Primary Languages</div>
          <div className="flex flex-wrap gap-2">
            {profile.technical_skills?.primary_languages?.length > 0 ? (
              profile.technical_skills?.primary_languages?.map((lang, i) => (
                <Badge key={i} className="bg-[#FF00FF] text-white border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold px-3 py-1 rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                  {lang}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-600 font-bold">No data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-black h-[3px]" />

        <div>
          <div className="text-sm text-black font-bold mb-3">Domain Expertise</div>
          <div className="space-y-2">
            {profile.technical_skills?.domain_expertise?.length > 0 ? (
              profile.technical_skills?.domain_expertise?.map((domain, i) => (
                <div key={i} className="text-sm text-black font-bold bg-[#F5F5F0] border-[3px] border-black p-2">
                  {domain}
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-600 font-bold">No data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-black h-[3px]" />

        <div className="bg-[#84CC16] border-[4px] border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-sm text-black font-bold mb-1">Activity Pattern</div>
          <div className="text-sm text-black font-bold">
            {profile.working_patterns?.commit_frequency || 'No data'}
          </div>
          <div className="text-xs text-black font-semibold mt-1">
            {profile.working_patterns?.consistency || ''}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skills Breakdown Card Component
function SkillsBreakdown({ skills }: { skills?: TechnicalSkills }) {
  if (!skills) return null

  return (
    <Card className="bg-white border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-[4px] border-black bg-[#0EA5E9] pb-4">
        <CardTitle className="text-white font-black flex items-center gap-2 text-xl">
          <Code className="w-6 h-6 text-white" />
          Technical Skills Breakdown
        </CardTitle>
        {skills.proficiency_level && (
          <CardDescription className="text-white font-bold text-base mt-2">
            Proficiency Level: <span className="text-[#FFD700] font-black">{skills.proficiency_level}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <h4 className="text-base font-black text-black mb-3 uppercase">Primary Languages</h4>
          <div className="flex flex-wrap gap-3">
            {skills.primary_languages?.length > 0 ? (
              skills.primary_languages?.map((lang, i) => (
                <Badge key={i} className="bg-[#00FFFF] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold px-4 py-2 text-sm rounded-none hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  {lang}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-600 font-bold">No languages identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-base font-black text-black mb-3 uppercase">Frameworks & Tools</h4>
          <div className="flex flex-wrap gap-3">
            {skills.frameworks_tools?.length > 0 ? (
              skills.frameworks_tools?.map((tool, i) => (
                <Badge key={i} className="bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold px-4 py-2 text-sm rounded-none hover:bg-[#FFEB3B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  {tool}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-600 font-bold">No frameworks identified</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-base font-black text-black mb-4 uppercase">Domain Expertise</h4>
          <div className="space-y-4">
            {skills.domain_expertise?.length > 0 ? (
              skills.domain_expertise?.map((domain, i) => (
                <div key={i} className="border-[4px] border-black p-3 bg-[#F5F5F0]">
                  <div className="text-sm text-black font-bold mb-2">{domain}</div>
                  <div className="relative h-6 bg-white border-[3px] border-black">
                    <div className="absolute inset-0 bg-[#84CC16] border-r-[3px] border-black" style={{ width: '75%' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-600 font-bold">No domain expertise identified</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Working Style Insights Component
function WorkingStyleInsights({ problemSolving, collaboration, workingPatterns }: {
  problemSolving?: ProblemSolving
  collaboration?: CollaborationStyle
  workingPatterns?: WorkingPatterns
}) {
  if (!problemSolving && !collaboration && !workingPatterns) return null
  return (
    <Card className="bg-white border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-[4px] border-black bg-[#FF00FF] pb-4">
        <CardTitle className="text-white font-black flex items-center gap-2 text-xl">
          <Lightbulb className="w-6 h-6 text-white" />
          Working Style & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="border-[4px] border-black p-4 bg-[#FFEB3B]">
          <h4 className="text-base font-black text-black mb-3 flex items-center gap-2 uppercase">
            <Target className="w-5 h-5" />
            Problem-Solving Approach
          </h4>
          <p className="text-black text-sm mb-4 font-bold">
            {problemSolving?.approach || 'No approach data available'}
          </p>
          {problemSolving?.strengths?.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-black font-black mb-2 uppercase">Key Strengths:</div>
              {problemSolving?.strengths?.map((strength, i) => (
                <div key={i} className="text-sm text-black font-bold flex items-start gap-2 bg-white border-[3px] border-black p-2">
                  <Star className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-black h-[3px]" />

        <div className="border-[4px] border-black p-4 bg-[#00FFFF]">
          <h4 className="text-base font-black text-black mb-3 flex items-center gap-2 uppercase">
            <Users className="w-5 h-5" />
            Collaboration Style
          </h4>
          <div className="space-y-3">
            {collaboration?.communication_quality && (
              <div className="bg-white border-[3px] border-black p-2">
                <span className="text-xs text-black font-black uppercase">Communication: </span>
                <span className="text-sm text-black font-bold">{collaboration.communication_quality}</span>
              </div>
            )}
            {collaboration?.team_interaction && (
              <div className="bg-white border-[3px] border-black p-2">
                <span className="text-xs text-black font-black uppercase">Team Interaction: </span>
                <span className="text-sm text-black font-bold">{collaboration.team_interaction}</span>
              </div>
            )}
            {collaboration?.review_participation && (
              <div className="bg-white border-[3px] border-black p-2">
                <span className="text-xs text-black font-black uppercase">Code Reviews: </span>
                <span className="text-sm text-black font-bold">{collaboration.review_participation}</span>
              </div>
            )}
            {!collaboration?.communication_quality && !collaboration?.team_interaction && !collaboration?.review_participation && (
              <span className="text-sm text-gray-600 font-bold">No collaboration data available</span>
            )}
          </div>
        </div>

        <Separator className="bg-black h-[3px]" />

        <div className="border-[4px] border-black p-4 bg-[#84CC16]">
          <h4 className="text-base font-black text-black mb-3 flex items-center gap-2 uppercase">
            <Clock className="w-5 h-5" />
            Working Patterns
          </h4>
          <div className="space-y-3">
            {workingPatterns?.focus_areas?.length > 0 && (
              <div>
                <div className="text-xs text-black font-black mb-2 uppercase">Focus Areas:</div>
                <div className="flex flex-wrap gap-2">
                  {workingPatterns?.focus_areas?.map((area, i) => (
                    <Badge key={i} className="bg-white text-black border-[3px] border-black font-bold px-3 py-1 rounded-none hover:bg-[#FFD700] transition-all">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {problemSolving?.code_quality_indicators?.length > 0 && (
          <>
            <Separator className="bg-black h-[3px]" />
            <div className="border-[4px] border-black p-4 bg-[#FF00FF]">
              <h4 className="text-base font-black text-white mb-3 uppercase">Code Quality Indicators</h4>
              <div className="space-y-2">
                {problemSolving?.code_quality_indicators?.map((indicator, i) => (
                  <div key={i} className="text-sm text-white font-bold bg-black/20 border-[2px] border-white p-2">• {indicator}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Unique Insights Component
function UniqueInsights({ insights }: { insights: string[] }) {
  if (!insights || insights.length === 0) return null

  return (
    <Card className="bg-white border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-[4px] border-black bg-[#84CC16] pb-4">
        <CardTitle className="text-black font-black flex items-center gap-2 text-xl">
          <TrendingUp className="w-6 h-6 text-black" />
          Notable Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-[#FFEB3B] border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Lightbulb className="w-6 h-6 text-black mt-0.5 flex-shrink-0" />
              <p className="text-black text-sm leading-relaxed font-bold">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Recommendations Component
function RecommendationsSection({ recommendations }: { recommendations?: Recommendations }) {
  if (!recommendations) return null

  const hasData = recommendations.ideal_projects?.length > 0 ||
                  recommendations.team_fit ||
                  recommendations.growth_opportunities?.length > 0

  if (!hasData) return null

  return (
    <Card className="bg-white border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <CardHeader className="border-b-[4px] border-black bg-[#FF00FF] pb-4">
        <CardTitle className="text-white font-black flex items-center gap-2 text-xl">
          <Target className="w-6 h-6 text-white" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {recommendations.ideal_projects?.length > 0 && (
          <div className="border-[4px] border-black p-4 bg-[#00FFFF]">
            <h4 className="text-base font-black text-black mb-3 uppercase">Ideal Projects</h4>
            <div className="space-y-2">
              {recommendations.ideal_projects?.map((project, i) => (
                <div key={i} className="text-sm text-black font-bold flex items-start gap-2 bg-white border-[3px] border-black p-3">
                  <GitBranch className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                  <span>{project}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.team_fit && (
          <>
            {recommendations.ideal_projects?.length > 0 && <Separator className="bg-black h-[3px]" />}
            <div className="border-[4px] border-black p-4 bg-[#FFD700]">
              <h4 className="text-base font-black text-black mb-2 uppercase">Team Fit</h4>
              <p className="text-sm text-black font-bold">{recommendations.team_fit}</p>
            </div>
          </>
        )}

        {recommendations.growth_opportunities?.length > 0 && (
          <>
            <Separator className="bg-black h-[3px]" />
            <div className="border-[4px] border-black p-4 bg-[#84CC16]">
              <h4 className="text-base font-black text-black mb-3 uppercase">Growth Opportunities</h4>
              <div className="space-y-2">
                {recommendations.growth_opportunities?.map((opportunity, i) => (
                  <div key={i} className="text-sm text-black font-bold flex items-start gap-2 bg-white border-[3px] border-black p-3">
                    <TrendingUp className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                    <span>{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Loading Indicator Component
function LoadingIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border-[5px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 bg-[#FF00FF] border-[5px] border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-black mb-3 uppercase">
                Analyzing GitHub Profile
              </h3>
              <p className="text-black text-base font-bold">
                {loadingSteps[currentStep] || 'Processing...'}
              </p>
            </div>
            <div className="w-full space-y-3 bg-[#F5F5F0] border-[4px] border-black p-5">
              {loadingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn(
                    "w-4 h-4 border-[3px] border-black flex-shrink-0",
                    i < currentStep ? "bg-[#84CC16]" :
                    i === currentStep ? "bg-[#FFD700]" :
                    "bg-white"
                  )} />
                  <span className={cn(
                    "text-sm font-bold",
                    i <= currentStep ? "text-black" : "text-gray-400"
                  )}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Home Component
export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null)
  const [showResults, setShowResults] = useState(false)

  const analyzeProfile = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentStep(0)

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev))
    }, 1500)

    try {
      const result = await callAIAgent(username.trim(), AGENT_ID)

      clearInterval(stepInterval)

      if (result.success) {
        setProfileData(result.response as ProfileResponse)
        setShowResults(true)
      } else {
        setError(result.error || 'Failed to analyze profile')
      }
    } catch (err) {
      clearInterval(stepInterval)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setCurrentStep(0)
    }
  }

  const handleSampleProfile = (sampleUsername: string) => {
    setUsername(sampleUsername)
    setTimeout(() => analyzeProfile(), 100)
  }

  const resetToSearch = () => {
    setShowResults(false)
    setProfileData(null)
    setUsername('')
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      analyzeProfile()
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFEF2] p-6 flex items-center justify-center">
        <LoadingIndicator currentStep={currentStep} />
      </div>
    )
  }

  // Results View
  if (showResults && profileData) {
    const profile = profileData.result as ProfileResult

    return (
      <div className="min-h-screen bg-[#FFFEF2]">
        <div className="container mx-auto px-6 py-8">
          {/* Header with back button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={resetToSearch}
              className="text-black font-bold hover:text-white hover:bg-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Analyze Another Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Quick Stats */}
            <div className="lg:col-span-1">
              <QuickStatsSidebar profile={profile} metadata={profileData.metadata} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Header */}
              <ProfileHeader profile={profile} />

              {/* Error handling */}
              {profileData.status === 'error' && (
                <Card className="bg-[#FF00FF] border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white border-[3px] border-black flex items-center justify-center flex-shrink-0">
                        <span className="text-black text-2xl font-black">!</span>
                      </div>
                      <div>
                        <h3 className="text-white font-black mb-2 text-lg uppercase">Analysis Error</h3>
                        <p className="text-white text-sm font-bold">
                          {profileData.message || 'Unable to analyze profile'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Breakdown */}
              <SkillsBreakdown skills={profile.technical_skills} />

              {/* Working Style Insights */}
              <WorkingStyleInsights
                problemSolving={profile.problem_solving}
                collaboration={profile.collaboration_style}
                workingPatterns={profile.working_patterns}
              />

              {/* Unique Insights */}
              <UniqueInsights insights={profile.unique_insights} />

              {/* Recommendations */}
              <RecommendationsSection recommendations={profile.recommendations} />

              {/* Metadata Footer */}
              {profileData.metadata && (
                <div className="text-center text-sm text-black font-bold pt-6 bg-[#F5F5F0] border-[4px] border-black p-4">
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Calendar className="w-5 h-5 text-black" />
                    <span>
                      Analyzed on {new Date(profileData.metadata.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-black font-black">•</span>
                    <span>
                      {profileData.metadata.data_points_collected} data points collected
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Homepage/Search View
  return (
    <div className="min-h-screen bg-[#FFFEF2]">
      <ScrollArea className="h-screen">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-[#FFD700] border-[5px] border-black flex items-center justify-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <Github className="w-14 h-14 text-black" />
              </div>
            </div>

            <h1 className="text-7xl font-black mb-6 text-black uppercase tracking-tight">
              SkillSync
            </h1>

            <p className="text-4xl font-black text-black mb-6 uppercase">
              Empathize at Scale
            </p>

            <p className="text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed font-bold">
              Understand developers beyond their code. Analyze GitHub profiles to discover
              working styles, collaboration patterns, and technical strengths.
            </p>

            {/* Search Input */}
            <div className="max-w-2xl mx-auto mb-4">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black z-10" />
                  <Input
                    type="text"
                    placeholder="Enter GitHub username (e.g., torvalds)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-14 h-16 text-lg bg-white border-[4px] border-black text-black placeholder:text-gray-500 font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none"
                  />
                </div>
                <Button
                  onClick={analyzeProfile}
                  disabled={loading || !username.trim()}
                  className="h-16 px-8 bg-[#FF00FF] hover:bg-[#00FFFF] text-white font-black text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-[4px] border-black rounded-none uppercase"
                >
                  Analyze Profile
                </Button>
              </div>
              {error && (
                <div className="bg-[#FF00FF] border-[4px] border-black p-3 mt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-white text-sm font-bold text-left">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sample Profiles Showcase */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-black mb-8 text-center uppercase">
              Try Sample Profiles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleProfiles.map((profile) => (
                <Card
                  key={profile.username}
                  className="bg-white border-[5px] border-black hover:bg-[#FFEB3B] transition-all cursor-pointer group shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none"
                  onClick={() => handleSampleProfile(profile.username)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#00FFFF] border-[4px] border-black flex items-center justify-center group-hover:bg-[#FF00FF] transition-all">
                        <Github className="w-7 h-7 text-black" />
                      </div>
                      <div>
                        <div className="font-black text-black text-lg">
                          {profile.name}
                        </div>
                        <div className="text-sm text-gray-700 font-bold">@{profile.username}</div>
                      </div>
                    </div>
                    <Badge className="bg-[#84CC16] text-black border-[3px] border-black font-bold px-3 py-1 rounded-none">
                      {profile.skill}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-black mb-10 text-center uppercase">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FFD700] border-[5px] border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Search className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 uppercase">
                  1. Enter Username
                </h3>
                <p className="text-black text-sm font-bold">
                  Simply provide a GitHub username to get started with the analysis
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#00FFFF] border-[5px] border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Code className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 uppercase">
                  2. AI Analysis
                </h3>
                <p className="text-black text-sm font-bold">
                  Our AI analyzes repositories, commits, and collaboration patterns
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#84CC16] border-[5px] border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <TrendingUp className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 uppercase">
                  3. Get Insights
                </h3>
                <p className="text-black text-sm font-bold">
                  Receive comprehensive insights about skills, style, and strengths
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <div className="inline-block bg-black text-white font-black text-sm px-6 py-3 border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
              Powered by AI Agent Technology
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
