/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ticket } from '../models/Ticket';
import type { TicketList } from '../models/TicketList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketsService {
    /**
     * List tickets
     * @returns TicketList List of tickets
     * @throws ApiError
     */
    public static getTickets(): CancelablePromise<TicketList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets',
        });
    }
    /**
     * Create new ticket
     * @returns Ticket Created ticket
     * @throws ApiError
     */
    public static postTicketsCreate({
        requestBody,
    }: {
        requestBody: {
            title: string;
            description: string;
            category?: string;
            facility?: string;
        },
    }): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tickets/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get ticket details
     * @returns Ticket Ticket details
     * @throws ApiError
     */
    public static getTickets1({
        ticketId,
    }: {
        ticketId: string,
    }): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tickets/{ticketId}',
            path: {
                'ticketId': ticketId,
            },
        });
    }
    /**
     * Update ticket info
     * @returns Ticket Updated ticket
     * @throws ApiError
     */
    public static patchTickets({
        ticketId,
        requestBody,
    }: {
        ticketId: string,
        requestBody: {
            title?: string;
            description?: string;
            status?: string;
        },
    }): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tickets/{ticketId}',
            path: {
                'ticketId': ticketId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Post reply to ticket
     * @returns Ticket Created reply
     * @throws ApiError
     */
    public static postTicketsReply({
        ticketId,
        requestBody,
    }: {
        ticketId: string,
        requestBody: {
            message: string;
        },
    }): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tickets/{ticketId}/reply',
            path: {
                'ticketId': ticketId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Update ticket solution
     * @returns Ticket Updated ticket
     * @throws ApiError
     */
    public static patchTicketsSolution({
        ticketId,
        requestBody,
    }: {
        ticketId: string,
        requestBody: {
            solution?: string;
            status?: string;
        },
    }): CancelablePromise<Ticket> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/tickets/{ticketId}/solution',
            path: {
                'ticketId': ticketId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
