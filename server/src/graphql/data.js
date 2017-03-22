import reviews from './reviews.json';

let computedRanking = {};

(() => {
  // compute all rankings once on the data import stage, no need to do it for each request

  const now = new Date();
  const fiveYearsAgoDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  const fiveYearsAgoTimestamp = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()).getTime();
  const accomodations = getAccomodations();

  accomodations.forEach((id) => {

    const accReviews = getReviews(id);
    const numberOfReviews = accReviews.length
    let generalRating = 0;
    let aspectsRating = {};

    accReviews.forEach((review) => {
      let weight = 0.5;
      if (review.entryDate >= fiveYearsAgoTimestamp) {
        let entryDate = new Date(review.entryDate),
          fixYear = 0; // need for situations when entryDate year is five years ago, however current month is less than entry month
        //as well as when current month less then entry month(and day) - will create correct weight relying on month, not only publication year
        if (entryDate.getMonth() > now.getMonth() || (entryDate.getMonth() == now.getMonth() && entryDate.getDate() > now.getDate())) {
          fixYear = 1;
        }

        weight = 1 - (now.getFullYear() - entryDate.getFullYear() - fixYear) * 0.1;
      }

      generalRating += review.ratings.general.general * weight;
      Object.keys(review.ratings.aspects).forEach((aspect) => {
        if (!aspectsRating[aspect]) {
          aspectsRating[aspect] = 0;
        }

        aspectsRating[aspect] += review.ratings.aspects[aspect] * weight;
      });
    })

    Object.keys(aspectsRating).forEach((aspect) => aspectsRating[aspect] /= numberOfReviews);
    computedRanking[id] = {
      general: generalRating / numberOfReviews,
      aspects: aspectsRating
    };
  });
})();

export function getTraveledWith() {
  let traveledWith = []

  reviews.forEach((review) => {
    if (traveledWith.indexOf(review.traveledWith) === -1) {
      traveledWith.push(review.traveledWith);
    }
  });

  return traveledWith.sort();
}

export function getAccomodations() {
  let accomodations = []

  reviews.forEach((review) => {
    if (Array.isArray(review.parents)) {
      review.parents.forEach((parent) => {
        if (accomodations.indexOf(parent.id) === -1) {
          accomodations.push(parent.id);
        }
      });
    }
  });

  return accomodations.sort();
}

export function getAccomodation(id) {
  let accomodations = []

  return { id };
}

export function getReviews(accomodation_id) {
  let accReviews = []

  reviews.forEach((review) => {
    if (review.parents.find((el) => el.id === accomodation_id)) {
      accReviews.push(review);
    }
  });

  return accReviews;
}

export function getAccomodationRanking(id) {
  return computedRanking[id];
}

export function getReviewTitle(review) {
  return review.titles[review.locale];
}

export function getReviewText(review) {
  return review.texts[review.locale];
}
