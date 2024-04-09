const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YZRHJ5lk4rMlUg5JDlFD23Jgi-lbtw9DNPGv_P7S",
  },
};

const getImageDetail = async () => {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/23f362ecd420755dd443b290ed1593f6/images/v2?sort_order=desc&per_page=20`,
    options
  );

  const { result } = await response.json();

  const squad = result.images.map((image: any) => {
    return {
      name: image.filename.split(".")[0].normalize("NFC"),
      imageId: image.id,
    };
  });

  console.log(squad);
};

getImageDetail();
