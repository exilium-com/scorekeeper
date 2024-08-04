
export interface Player {
    name: string
    placeholder: string
}

export interface Score {
    score: number
    invalid?: boolean
}

export interface Round {
    round: number
    scores: Score []
  }

