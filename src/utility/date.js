import { subMonths, parseISO, parse } from "date-fns";

export function getFormattedDate(date) {
  if (!date) return "";
  try {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  } catch (error) {
    console.error("getFormattedDate error:", error);
    return "";
  }
}

export const convertDateFormat = (dateString) => {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("convertDateFormat error:", error);
    return "";
  }
};
export const deleteClock = (dates) => {
  if (!dates) return "";
  try {
    return dates.split(" ")[0];
  } catch (error) {
    console.error("deleteClock error:", error);
    return "";
  }
};

export const getChangeDate = (dates) => {
  if (!dates) return new Date();
  try {
    const first = dates.split(" ")[0];
    const second = first.split(".");
    if (second.length !== 3) return new Date();
    return new Date(second[2], second[1] - 1, second[0]);
  } catch (error) {
    console.error("getChangeDate error:", error);
    return new Date();
  }
};
export const parseDate = (dateString) => {
  if (!dateString) return new Date();
  try {
    return parse(dateString, "dd.MM.yyyy HH:mm:ss", new Date());
  } catch (error) {
    console.error("parseDate error:", error);
    return new Date();
  }
};

export const addT = (dateString) => {
  if (!dateString) {
    // dateString'in tanımlı olup olmadığını kontrol et
    console.log('dateString is undefined or null');
    return;
  }


  const parts = dateString.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})/);

  if (!parts || parts.length < 7) {
    // Eşleşme bulunamadıysa veya beklenen parçalar eksikse hata mesajı göster
    console.log('Invalid date format');
    return;
  }
  // Yeni formatı oluştur
  return `${parts[3]}-${parts[2]}-${parts[1]}T${parts[4]}:${parts[5]}:${parts[6]}`;
  //2024-01-28T11:08:00
  
};
