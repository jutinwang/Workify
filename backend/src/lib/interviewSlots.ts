export type BusyEvent = {
    id?: string;
    start: string;
    end: string;
    text?: string;
};

export type Slot = {
    id: string;
    start: string;
    end: string;
};

export function computeProposedSlotsFromBusy(
    busyEvents: BusyEvent[] | null | undefined,
    durationMinutes: number,
    daysAhead = 7
): Slot[] {
    const result: Slot[] = [];
    const now = new Date();

    const normalized = (busyEvents || []).map((e) => ({...e,startDate: new Date(e.start),endDate: new Date(e.end),})).filter((e) => !Number.isNaN(e.startDate.getTime()) && !Number.isNaN(e.endDate.getTime())).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const msPerMinute = 60 * 1000;
    const durationMs = durationMinutes * msPerMinute;

    for (let offset = 0; offset < daysAhead; offset++) {
        const day = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + offset,
            0,
            0,
            0,
            0
        );

        const dayStart = new Date(day);
        dayStart.setHours(9, 0, 0, 0);
        const dayEnd = new Date(day);
        dayEnd.setHours(17, 0, 0, 0);

        let freeSegments: { start: Date; end: Date }[] = [{ start: dayStart, end: dayEnd }];

        for (const busy of normalized) {
            if (busy.endDate <= dayStart || busy.startDate >= dayEnd) continue;

            const newFree: { start: Date; end: Date }[] = [];
            for (const seg of freeSegments) {
                if (busy.endDate <= seg.start || busy.startDate >= seg.end) {
                    newFree.push(seg);
                    continue;
                }
                if (busy.startDate > seg.start) {
                    newFree.push({ start: seg.start, end: new Date(busy.startDate) });
                }
                if (busy.endDate < seg.end) {
                    newFree.push({ start: new Date(busy.endDate), end: seg.end });
                }
            }
            freeSegments = newFree;
            if (freeSegments.length === 0) break;
        }

        for (const seg of freeSegments) {
            let slotStart = new Date(seg.start);
            while (slotStart.getTime() + durationMs <= seg.end.getTime()) {
                const slotEnd = new Date(slotStart.getTime() + durationMs);
                result.push({
                    id: `${slotStart.toISOString()}_${slotEnd.toISOString()}`,
                    start: slotStart.toISOString(),
                    end: slotEnd.toISOString(),
                });

                slotStart = new Date(slotStart.getTime() + durationMs);
            }
        }
    }
    return result;
}
