import reviews from './reviews.json';

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
  let acc_reviews = []

  reviews.forEach((review) => {
    if (review.parents.find((el) => el.id === accomodation_id)) {
      acc_reviews.push(review);
    }
  });

  return acc_reviews;
}
