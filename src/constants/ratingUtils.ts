export const getRatingDescription = (rating: string, short: boolean = false) => {
  if (short) {
    // Returnera endast åldersgränsen i kort version
    switch (rating) {
      case "G":
        return "All ages";
      case "PG":
        return "7+";
      case "PG-13":
        return "13+";
      case "R":
        return "17+";
      case "NC-17":
        return "18+";
      case "Not Rated":
        return "No Age Limit";
      default:
        return rating; // Returnera rating som den är om den inte finns i listan
    }
  } else {
    // Returnera fullständig beskrivning i lång version
    switch (rating) {
      case "G":
        return "General Audience - All ages admitted.";
      case "PG":
        return "Parental Guidance Suggested - Some material may not be suitable for children.";
      case "PG-13":
        return "Parents Strongly Cautioned - Some material may be inappropriate for children under 13.";
      case "R":
        return "Restricted - Under 17 requires accompanying parent or adult guardian.";
      case "NC-17":
        return "Adults Only - No one 17 and under admitted.";
      case "Not Rated":
        return "No Age Limit - This film has no age limit.";
      default:
        return rating; // Returnera rating som den är om den inte finns i listan
    }
  }
};
