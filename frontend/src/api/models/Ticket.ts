/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Reply } from './Reply';
export type Ticket = {
    ticket_id: string;
    title: string;
    status: string;
    created_at: string;
    description?: string;
    category?: string;
    facility?: string;
    priority?: string;
    ticket_number?: string;
    created_by?: string;
    created_by_name?: string;
    updated_at?: string;
    solution_reply_id?: string;
    ai_feedback?: string;
    ai_request_in_progress?: string;
    replies?: Array<Reply>;
};

