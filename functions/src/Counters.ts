export const getUpdatedCount = (db: any, ref: string, activeToggle: boolean, counterType: string) => db
  .doc(ref)
  .get()
  .then((doc: any) => {
    const data = doc.data();

    // get counter value or initialize
    let count = data[counterType] ? data[counterType] : 0;

    // increment counter
    if (activeToggle) {
      count += 1;
    } else {
      count -= 1;
    }

    // updated counter payload
    const payload: { [key: string]: any } = {};
    payload[counterType] = count;
    return payload;
  });
