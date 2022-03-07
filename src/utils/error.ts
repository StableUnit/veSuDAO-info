export const DEFAULT_ERROR_TEXT = 'Transaction failed, check dates and permissions';

export const getErrorMessage = (e?: Error) => {
  if (e?.message?.indexOf) {
    const messageText = '"message": "';
    const messageIndex = e.message.indexOf(messageText);
    if (messageIndex === -1) {
      return;
    }
    const messageIndexStart = messageIndex + messageText.length;
    const messageIndexEnd = e.message.indexOf('"', messageIndexStart);
    return e.message.slice(messageIndexStart, messageIndexEnd);
  }

  return;
}