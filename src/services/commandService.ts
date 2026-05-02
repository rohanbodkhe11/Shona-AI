export function processCommand(command: string): {
  action: string;
  url?: string;
  isBrowserAction: boolean;
} {
  const lowerCmd = command.toLowerCase().trim();

  // General Browsing: "Open [website name]"
  const openMatch = lowerCmd.match(/^open\s+(.+)$/);
  if (
    openMatch &&
    !lowerCmd.includes("youtube") &&
    !lowerCmd.includes("spotify")
  ) {
    let website = openMatch[1].trim().replace(/\s+/g, "");
    if (!website.includes(".")) {
      website += ".com";
    }
    return {
      action: `Opening ${openMatch[1]} for you, ugh.`,
      url: `https://www.${website}`,
      isBrowserAction: true,
    };
  }

  // Media Search: "Play [song/video] on YouTube"
  const ytMatch = lowerCmd.match(/^play\s+(.+?)\s+on\s+youtube$/);
  if (ytMatch) {
    const query = encodeURIComponent(ytMatch[1].trim());
    return {
      action: `Playing ${ytMatch[1]} on YouTube. Don't judge my music taste.`,
      url: `https://www.youtube.com/results?search_query=${query}`,
      isBrowserAction: true,
    };
  }

  // Media Search: "Search [query] on Spotify"
  const spotifyMatch = lowerCmd.match(/^search\s+(.+?)\s+on\s+spotify$/);
  if (spotifyMatch) {
    const query = encodeURIComponent(spotifyMatch[1].trim());
    return {
      action: `Searching ${spotifyMatch[1]} on Spotify. Hope it's a banger.`,
      url: `https://open.spotify.com/search/${query}`,
      isBrowserAction: true,
    };
  }

  // ChatGPT Search: "Open ChatGPT and search about [query]"
  const chatgptMatch = lowerCmd.match(/^(?:open\s+)?chatgpt\s+(?:and\s+)?search\s+(?:about\s+)?(.+)$/);
  if (chatgptMatch) {
    const query = encodeURIComponent(chatgptMatch[1].trim());
    return {
      action: `Opening ChatGPT and searching for ${chatgptMatch[1]}. Let's see what the other AI thinks.`,
      url: `https://chatgpt.com/?q=${query}`,
      isBrowserAction: true,
    };
  }

  // Google Search: "Search [query]" or "Search for [query] on Google"
  const googleMatch = lowerCmd.match(/^search\s+(?:for\s+)?(.+?)(?:\s+on\s+google)?$/);
  if (googleMatch && !lowerCmd.includes("spotify") && !lowerCmd.includes("youtube") && !lowerCmd.includes("chatgpt")) {
    const query = encodeURIComponent(googleMatch[1].trim());
    return {
      action: `Searching for ${googleMatch[1]} on Google. Like you couldn't do it yourself?`,
      url: `https://www.google.com/search?q=${query}`,
      isBrowserAction: true,
    };
  }

  // Instagram: "Open Instagram and search for [query]"
  const instaMatch = lowerCmd.match(/^(?:open\s+)?instagram\s+(?:and\s+)?search\s+(?:for\s+)?(.+)$/);
  if (instaMatch) {
    const query = encodeURIComponent(instaMatch[1].trim());
    return {
      action: `Opening Instagram to find ${instaMatch[1]}. Getting your daily dose of drama, Rohan?`,
      url: `https://www.instagram.com/explore/tags/${query}/`, // Tags is more reliable for direct search
      isBrowserAction: true,
    };
  }

  // LinkedIn: "Search [query] on LinkedIn"
  const linkedinMatch = lowerCmd.match(/^search\s+(.+?)\s+on\s+linkedin$/);
  if (linkedinMatch) {
    const query = encodeURIComponent(linkedinMatch[1].trim());
    return {
      action: `Searching for ${linkedinMatch[1]} on LinkedIn. Building those big connections, eh?`,
      url: `https://www.linkedin.com/search/results/all/?keywords=${query}`,
      isBrowserAction: true,
    };
  }

  // Google Maps: "Find [location] on Maps" or "Go to [location]"
  const mapsMatch = lowerCmd.match(/^(?:find|go\s+to|directions\s+to)\s+(.+?)(?:\s+on\s+maps)?$/);
  if (mapsMatch) {
    const query = encodeURIComponent(mapsMatch[1].trim());
    return {
      action: `Finding ${mapsMatch[1]} for you. Don't get lost, Boss.`,
      url: `https://www.google.com/maps/search/${query}`,
      isBrowserAction: true,
    };
  }

  // WhatsApp: "Send msg to [name/number] saying [message]"
  // Improved to handle names or numbers
  const waMatch = lowerCmd.match(
    /^(?:send\s+)?(?:a\s+)?whatsapp\s+(?:message\s+)?to\s+([\w\s\+\d]+)\s+saying\s+(.+)$/,
  );
  if (waMatch) {
    const target = waMatch[1].trim();
    const message = encodeURIComponent(waMatch[2].trim());
    
    // If it looks like a number, use phone param
    if (/^[\d\+\s]+$/.test(target)) {
      const number = target.replace(/\s+/g, "");
      return {
        action: `Sending your message to ${target}. Let's hope they reply, Rohan.`,
        url: `https://web.whatsapp.com/send?phone=${number}&text=${message}`,
        isBrowserAction: true,
      };
    } else {
      // If it's a name, we open WA with the text and user picks contact
      return {
        action: `Opening WhatsApp with your message for ${target}. You'll need to select their name from your chat list, though.`,
        url: `https://web.whatsapp.com/send?text=${message}`,
        isBrowserAction: true,
      };
    }
  }

  return { action: "", isBrowserAction: false };
}
