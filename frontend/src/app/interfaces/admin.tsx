export interface Event {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    is_active: boolean
    picture: string | null
}

export interface MealSession {
    id: string
    event_id: string
    meal_type: string
    start_time: string
    end_time: string
    is_active: boolean
    total_capacity: number
}

export interface User {
    id: string
    username: string
    email: string | null
    role_id: number
    is_active: boolean
}

export interface Feedback {
    id: string
    response: string
    user_id: string
    created_at: string
}

export interface FoodClaim {
    id: string
    user_id: string
    meal_session_id: string
    event_id: string
    claimed_at: string
    is_claimed: boolean
}