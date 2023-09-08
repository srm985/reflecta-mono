const dateStamp = (date?: Date | string): string => (date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

export default dateStamp;
